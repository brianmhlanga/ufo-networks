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
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get query parameters for date filtering
    const query = getQuery(event)
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string

    // Build date filter
    const dateFilter: any = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) {
        dateFilter.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        dateFilter.createdAt.lte = new Date(dateTo)
      }
    }

    // Get agent sale statistics
    const [
      totalSales,
      totalRevenue,
      totalProfit,
      salesByAgent,
      salesByLocation,
      recentSales,
      topAgents
    ] = await Promise.all([
      // Total sales count
      prisma.agentSale.count({ where: dateFilter }),
      
      // Total revenue from sales
      prisma.agentSale.aggregate({
        where: dateFilter,
        _sum: { soldPrice: true }
      }),
      
      // Total profit (sold price - unit cost)
      prisma.agentSale.aggregate({
        where: dateFilter,
        _sum: {
          soldPrice: true
        }
      }),
      
      // Sales by agent
      prisma.agentSale.groupBy({
        by: ['agentId'],
        where: dateFilter,
        _count: { agentId: true },
        _sum: { soldPrice: true }
      }),
      
      // Sales by location
      prisma.agentSale.groupBy({
        by: ['agentPurchaseId'],
        where: dateFilter,
        _count: { agentPurchaseId: true },
        _sum: { soldPrice: true }
      }),
      
      // Recent sales (last 5)
      prisma.agentSale.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          agent: {
            select: {
              displayName: true
            }
          },
          voucher: {
            select: {
              voucherNumber: true
            }
          }
        }
      }),
      
      // Top agents by sales count
      prisma.agentSale.groupBy({
        by: ['agentId'],
        where: dateFilter,
        _count: { agentId: true },
        _sum: { soldPrice: true },
        orderBy: { _count: { agentId: 'desc' } },
        take: 5
      })
    ])

    // Get agent names for top agents
    const agentIds = topAgents.map(item => item.agentId)
    const agents = await prisma.agentProfile.findMany({
      where: { id: { in: agentIds } },
      select: { 
        id: true, 
        displayName: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Map agent data
    const topAgentsWithNames = topAgents.map(item => {
      const agent = agents.find(ag => ag.id === item.agentId)
      return {
        agentId: item.agentId,
        agentName: agent?.displayName || agent?.user?.name || 'Unknown',
        salesCount: item._count.agentId,
        totalRevenue: item._sum.soldPrice || 0
      }
    })

    // Get location names for sales by location
    const purchaseIds = salesByLocation.map(item => item.agentPurchaseId)
    const purchases = await prisma.agentPurchase.findMany({
      where: { id: { in: purchaseIds } },
      select: { 
        id: true,
        location: {
          select: {
            name: true,
            code: true
          }
        },
        batch: {
          select: {
            name: true
          }
        }
      }
    })

    // Map location data
    const salesByLocationWithNames = salesByLocation.map(item => {
      const purchase = purchases.find(p => p.id === item.agentPurchaseId)
      return {
        locationName: purchase?.location?.name || 'Unknown',
        locationCode: purchase?.location?.code || 'Unknown',
        batchName: purchase?.batch?.name || 'No Batch',
        salesCount: item._count.agentPurchaseId,
        totalRevenue: item._sum.soldPrice || 0
      }
    })

    // Calculate average sale value
    const averageSaleValue = totalSales > 0 ? (totalRevenue._sum.soldPrice || 0) / totalSales : 0

    return {
      success: true,
      stats: {
        totalSales,
        totalRevenue: totalRevenue._sum.soldPrice || 0,
        averageSaleValue,
        topAgents: topAgentsWithNames,
        salesByLocation: salesByLocationWithNames,
        recentSales
      }
    }
  } catch (error) {
    console.error('Error fetching agent sale stats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
