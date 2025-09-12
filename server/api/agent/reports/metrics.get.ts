import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getUserSession(event)
    
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Agent profile not found'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const { dateRange, locationId, voucherType } = query

    // Build date filter
    let dateFilter = {}
    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate = new Date()
      
      switch (dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7)
          break
        case '30days':
          startDate.setDate(now.getDate() - 30)
          break
        case '90days':
          startDate.setDate(now.getDate() - 90)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }
      
      dateFilter = {
        createdAt: {
          gte: startDate
        }
      }
    }

    // Build location filter
    let locationFilter = {}
    if (locationId && locationId !== 'all') {
      locationFilter = {
        voucher: {
          locationId: locationId as string
        }
      }
    }

    // Build voucher type filter
    let voucherTypeFilter = {}
    if (voucherType && voucherType !== 'all') {
      const [hours, numberOfUsers] = (voucherType as string).split('-').map(Number)
      voucherTypeFilter = {
        voucher: {
          hours,
          numberOfUsers
        }
      }
    }

    // Get total sales count
    const totalSales = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        ...dateFilter,
        ...locationFilter,
        ...voucherTypeFilter
      }
    })

    // Get total revenue
    const revenueResult = await prisma.agentSale.aggregate({
      where: {
        agentId: agentProfile.id,
        ...dateFilter,
        ...locationFilter,
        ...voucherTypeFilter
      },
      _sum: {
        soldPrice: true
      }
    })

    const totalRevenue = Number(revenueResult._sum.soldPrice || 0)

    // Get total profit (revenue - agent cost)
    const salesWithCosts = await prisma.agentSale.findMany({
      where: {
        agentId: agentProfile.id,
        ...dateFilter,
        ...locationFilter,
        ...voucherTypeFilter
      },
      include: {
        agentPurchase: {
          select: {
            unitCost: true
          }
        }
      }
    })

    const totalProfit = salesWithCosts.reduce((sum, sale) => {
      const sellingPrice = Number(sale.soldPrice)
      const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
      return sum + (sellingPrice - buyingPrice)
    }, 0)

    // Get active entitlements
    const activeEntitlements = await prisma.agentPurchase.aggregate({
      where: {
        agentId: agentProfile.id,
        ...(locationId && locationId !== 'all' ? { locationId: locationId as string } : {}),
        ...(voucherType && voucherType !== 'all' ? {
          hours: parseInt((voucherType as string).split('-')[0]),
          numberOfUsers: parseInt((voucherType as string).split('-')[1])
        } : {})
      },
      _sum: {
        quantity: true,
        claimedCount: true
      }
    })

    const totalEntitlements = Number(activeEntitlements._sum.quantity || 0)
    const totalClaimed = Number(activeEntitlements._sum.claimedCount || 0)
    const availableEntitlements = totalEntitlements - totalClaimed

    return {
      success: true,
      data: {
        totalSales,
        totalRevenue,
        totalProfit,
        activeEntitlements: Math.max(0, availableEntitlements)
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent metrics:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
