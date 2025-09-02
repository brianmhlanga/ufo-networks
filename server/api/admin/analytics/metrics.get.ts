import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and has admin role
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const { dateRange = '30d', locationId, userRole, voucherStatus } = query

    // Calculate date range
    const { startDate, endDate, previousStartDate } = calculateDateRange(dateRange as string)

    // Build where clauses
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    const previousWhereClause: any = {
      createdAt: {
        gte: previousStartDate,
        lte: startDate
      }
    }

    if (locationId) {
      whereClause.locationId = locationId
      previousWhereClause.locationId = locationId
    }

    if (userRole) {
      whereClause.user = { role: userRole }
      previousWhereClause.user = { role: userRole }
    }

    if (voucherStatus) {
      whereClause.status = voucherStatus
      previousWhereClause.status = voucherStatus
    }

    // Get current period metrics
    const [
      currentRevenue,
      currentVouchers,
      currentUsers,
      currentOrders
    ] = await Promise.all([
      // Revenue from orders and agent sales
      prisma.$transaction([
        prisma.order.aggregate({
          where: whereClause,
          _sum: { total: true }
        }),
        prisma.agentSale.aggregate({
          where: whereClause,
          _sum: { soldPrice: true }
        })
      ]),
      // Voucher metrics
      prisma.voucher.aggregate({
        where: whereClause,
        _count: { id: true },
        _sum: { usageCount: true }
      }),
      // User metrics
      prisma.user.aggregate({
        where: whereClause,
        _count: { id: true }
      }),
      // Order metrics
      prisma.order.aggregate({
        where: whereClause,
        _count: { id: true }
      })
    ])

    // Get previous period metrics for comparison
    const [
      previousRevenue,
      previousVouchers,
      previousUsers,
      previousOrders
    ] = await Promise.all([
      prisma.$transaction([
        prisma.order.aggregate({
          where: previousWhereClause,
          _sum: { total: true }
        }),
        prisma.agentSale.aggregate({
          where: previousWhereClause,
          _sum: { soldPrice: true }
        })
      ]),
      prisma.voucher.aggregate({
        where: previousWhereClause,
        _count: { id: true },
        _sum: { usageCount: true }
      }),
      prisma.user.aggregate({
        where: previousWhereClause,
        _count: { id: true }
      }),
      prisma.order.aggregate({
        where: previousWhereClause,
        _count: { id: true }
      })
    ])

    // Calculate current metrics
    const currentTotalRevenue = Number(currentRevenue[0]._sum.total || 0) + Number(currentRevenue[1]._sum.soldPrice || 0)
    const currentActiveVouchers = currentVouchers._count.id || 0
    const currentTotalUsers = currentUsers._count.id || 0
    const currentTotalOrders = currentOrders._count.id || 0

    // Calculate previous metrics
    const previousTotalRevenue = Number(previousRevenue[0]._sum.total || 0) + Number(previousRevenue[1]._sum.soldPrice || 0)
    const previousTotalUsers = previousUsers._count.id || 0
    const previousTotalOrders = previousOrders._count.id || 0

    // Calculate growth percentages
    const revenueGrowth = previousTotalRevenue > 0 
      ? ((currentTotalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100 
      : 0

    const userGrowth = previousTotalUsers > 0 
      ? ((currentTotalUsers - previousTotalUsers) / previousTotalUsers) * 100 
      : 0

    const conversionGrowth = previousTotalOrders > 0 
      ? ((currentTotalOrders - previousTotalOrders) / previousTotalOrders) * 100 
      : 0

    // Get voucher utilization (percentage of vouchers that have been used)
    const totalVouchers = await prisma.voucher.count()
    const usedVouchers = await prisma.voucher.count({
      where: { usageCount: { gt: 0 } }
    })
    const voucherUtilization = totalVouchers > 0 ? (usedVouchers / totalVouchers) * 100 : 0

    // Calculate conversion rate (orders / total users)
    const conversionRate = currentTotalUsers > 0 ? (currentTotalOrders / currentTotalUsers) * 100 : 0

    // Get additional metrics
    const [
      totalLocations,
      activeLocations,
      totalAgents,
      activeAgents,
      activeAds,
      totalImpressions,
      totalClicks
    ] = await Promise.all([
      prisma.location.count(),
      prisma.location.count({ where: { vouchers: { some: { status: { in: ['AVAILABLE', 'RESERVED'] } } } } }),
      prisma.agentProfile.count(),
      prisma.agentProfile.count({ where: { sales: { some: {} } } }),
      prisma.ad.count({ where: { active: true } }),
      prisma.ad.aggregate({ _sum: { impressions: true } }),
      prisma.ad.aggregate({ _sum: { clicks: true } })
    ])

    // Calculate average commission
    const agentDiscounts = await prisma.agentVoucherDiscount.aggregate({
      _avg: { discountPercentage: true }
    })
    const avgCommission = agentDiscounts._avg.discountPercentage || 0

    // Calculate click rate
    const clickRate = (totalImpressions._sum.impressions || 0) > 0 
      ? ((totalClicks._sum.clicks || 0) / (totalImpressions._sum.impressions || 0)) * 100 
      : 0

    // Determine coverage area based on provinces
    const provinces = await prisma.location.groupBy({
      by: ['province'],
      _count: { id: true }
    })
    const coverageArea = provinces.length > 0 ? `${provinces.length} provinces` : 'N/A'

    return {
      success: true,
      metrics: {
        totalRevenue: Number(currentTotalRevenue),
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        activeVouchers: currentActiveVouchers,
        voucherUtilization: Math.round(voucherUtilization * 100) / 100,
        totalUsers: currentTotalUsers,
        newUsers: currentTotalUsers,
        conversionRate: Math.round(conversionRate * 100) / 100,
        conversionGrowth: Math.round(conversionGrowth * 100) / 100,
        totalLocations,
        activeLocations,
        coverageArea,
        totalAgents,
        activeAgents,
        avgCommission: Math.round(Number(avgCommission) * 100) / 100,
        activeAds,
        totalImpressions: totalImpressions._sum.impressions || 0,
        clickRate: Math.round(clickRate * 100) / 100
      }
    }

  } catch (error: any) {
    console.error('Error fetching analytics metrics:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics metrics'
    })
  }
})

function calculateDateRange(dateRange: string) {
  const endDate = new Date()
  let startDate: Date
  let previousStartDate: Date

  switch (dateRange) {
    case '7d':
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '6m':
      startDate = new Date(endDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  return { startDate, endDate, previousStartDate }
}
