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
    const { startDate, endDate } = calculateDateRange(dateRange as string)

    // Build where clauses
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (locationId) {
      whereClause.locationId = locationId
    }

    if (userRole) {
      whereClause.user = { role: userRole }
    }

    if (voucherStatus) {
      whereClause.status = voucherStatus
    }

    // Get chart data
    const [
      revenueTrend,
      locationSales,
      voucherStatusData,
      userGrowth,
      networkPerformance,
      advertising
    ] = await Promise.all([
      getRevenueTrend(startDate, endDate, whereClause),
      getLocationSales(startDate, endDate, whereClause),
      getVoucherStatusDistribution(),
      getUserGrowth(startDate, endDate, whereClause),
      getNetworkPerformance(startDate, endDate, whereClause),
      getAdvertisingPerformance(startDate, endDate, whereClause)
    ])

    return {
      success: true,
      revenueTrend,
      locationSales,
      voucherStatus: voucherStatusData,
      userGrowth,
      networkPerformance,
      advertising
    }

  } catch (error: any) {
    console.error('Error fetching analytics charts:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics charts'
    })
  }
})

async function getRevenueTrend(startDate: Date, endDate: Date, whereClause: any) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const labels = []
  const data = []

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    // Get revenue for this day
    const [orderRevenue, agentRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          ...whereClause,
          createdAt: { gte: date, lt: nextDate }
        },
        _sum: { total: true }
      }),
      prisma.agentSale.aggregate({
        where: {
          ...whereClause,
          createdAt: { gte: date, lt: nextDate }
        },
        _sum: { soldPrice: true }
      })
    ])
    
    const dailyRevenue = (orderRevenue._sum.total || 0) + (agentRevenue._sum.soldPrice || 0)
    data.push(Number(dailyRevenue))
  }

  return { labels, data }
}

async function getLocationSales(startDate: Date, endDate: Date, whereClause: any) {
  const locationSales = await prisma.location.findMany({
    where: whereClause.locationId ? { id: whereClause.locationId } : {},
    select: {
      id: true,
      name: true,
      code: true,
      _count: {
        select: {
          vouchers: {
            where: {
              status: { in: ['SOLD', 'REDEEMED'] },
              createdAt: { gte: startDate, lte: endDate }
            }
          }
        }
      }
    }
  })

  const labels = locationSales.map(loc => `${loc.name} (${loc.code})`)
  const data = locationSales.map(loc => loc._count.vouchers)

  return { labels, data }
}

async function getVoucherStatusDistribution() {
  const statusCounts = await prisma.voucher.groupBy({
    by: ['status'],
    _count: { id: true }
  })

  const labels = statusCounts.map(item => item.status)
  const data = statusCounts.map(item => item._count.id)

  return { labels, data }
}

async function getUserGrowth(startDate: Date, endDate: Date, whereClause: any) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const labels = []
  const data = []

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    const userCount = await prisma.user.count({
      where: {
        ...whereClause.user,
        createdAt: { gte: date, lt: nextDate }
      }
    })
    
    data.push(userCount)
  }

  return { labels, data }
}

async function getNetworkPerformance(startDate: Date, endDate: Date, whereClause: any) {
  // Calculate various performance metrics
  const [
    voucherUsage,
    networkLoad,
    userSatisfaction,
    revenuePerUser,
    agentPerformance
  ] = await Promise.all([
    // Voucher usage rate
    prisma.voucher.aggregate({
      where: {
        ...whereClause,
        usageCount: { gt: 0 }
      },
      _avg: { usageCount: true }
    }),
    // Network load (total vouchers created)
    prisma.voucher.count({
      where: {
        ...whereClause,
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    // User satisfaction (orders completed)
    prisma.order.count({
      where: {
        ...whereClause,
        status: 'PAID',
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    // Revenue per user
    prisma.order.aggregate({
      where: {
        ...whereClause,
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true }
    }),
    // Agent performance
    prisma.agentSale.count({
      where: {
        ...whereClause,
        createdAt: { gte: startDate, lte: endDate }
      }
    })
  ])

  // Normalize scores to 0-100 range
  const data = [
    Math.min(100, (voucherUsage._avg.usageCount || 0) * 20), // Voucher usage
    Math.min(100, (networkLoad / 100) * 100), // Network load
    Math.min(100, (userSatisfaction / 50) * 100), // User satisfaction
    Math.min(100, ((revenuePerUser._sum.total || 0) / 1000) * 100), // Revenue per user
    Math.min(100, (agentPerformance / 20) * 100) // Agent performance
  ]

  return { data }
}

async function getAdvertisingPerformance(startDate: Date, endDate: Date, whereClause: any) {
  const ads = await prisma.ad.findMany({
    where: {
      active: true,
      startsAt: { lte: endDate },
      endsAt: { gte: startDate }
    },
    select: {
      id: true,
      title: true,
      impressions: true,
      clicks: true
    }
  })

  const labels = ads.map(ad => ad.title)
  const impressions = ads.map(ad => ad.impressions)
  const clicks = ads.map(ad => ad.clicks)

  return { labels, impressions, clicks }
}

function calculateDateRange(dateRange: string) {
  const endDate = new Date()
  let startDate: Date

  switch (dateRange) {
    case '7d':
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '6m':
      startDate = new Date(endDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  return { startDate, endDate }
}
