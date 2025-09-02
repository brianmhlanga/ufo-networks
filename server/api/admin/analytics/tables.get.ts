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

    // Get table data
    const [topLocations, topAgents, recentActivity] = await Promise.all([
      getTopLocations(startDate, endDate, whereClause),
      getTopAgents(startDate, endDate, whereClause),
      getRecentActivity(startDate, endDate, whereClause)
    ])

    return {
      success: true,
      topLocations,
      topAgents,
      recentActivity
    }

  } catch (error: any) {
    console.error('Error fetching analytics tables:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics tables'
    })
  }
})

async function getTopLocations(startDate: Date, endDate: Date, whereClause: any) {
  // Get locations with highest revenue and voucher sales
  const locations = await prisma.location.findMany({
    where: whereClause.locationId ? { id: whereClause.locationId } : {},
    select: {
      id: true,
      name: true,
      town: true,
      province: true,
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

  // Calculate revenue for each location
  const locationsWithRevenue = await Promise.all(
    locations.map(async (location) => {
      const [orderRevenue, agentRevenue] = await Promise.all([
        prisma.orderItem.aggregate({
          where: {
            locationId: location.id,
            order: {
              createdAt: { gte: startDate, lte: endDate }
            }
          },
          _sum: { lineTotal: true }
        }),
        prisma.agentSale.aggregate({
          where: {
            voucher: {
              locationId: location.id,
              createdAt: { gte: startDate, lte: endDate }
            }
          },
          _sum: { soldPrice: true }
        })
      ])

      const totalRevenue = (orderRevenue._sum.lineTotal || 0) + (agentRevenue._sum.soldPrice || 0)
      const vouchersSold = location._count.vouchers

      return {
        id: location.id,
        name: location.name,
        town: location.town || 'N/A',
        province: location.province || 'N/A',
        code: location.code,
        revenue: Number(totalRevenue),
        vouchersSold
      }
    })
  )

  // Sort by revenue and return top 10
  return locationsWithRevenue
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

async function getTopAgents(startDate: Date, endDate: Date, whereClause: any) {
  // Get agents with highest sales volume
  const agentSales = await prisma.agentSale.groupBy({
    by: ['agentId'],
    where: {
      createdAt: { gte: startDate, lte: endDate }
    },
    _count: { id: true },
    _sum: { soldPrice: true }
  })

  // Get agent details
  const agentsWithDetails = await Promise.all(
    agentSales.map(async (sale) => {
      const agent = await prisma.agentProfile.findUnique({
        where: { id: sale.agentId },
        select: {
          id: true,
          displayName: true,
          defaultDiscountPct: true,
          user: {
            select: {
              email: true,
              phone: true
            }
          }
        }
      })

      if (!agent) return null

      const totalSales = Number(sale._sum.soldPrice || 0)
      const salesCount = sale._count.id
      const commission = Number(agent.defaultDiscountPct || 0)

      return {
        id: agent.id,
        displayName: agent.displayName,
        email: agent.user.email,
        phone: agent.user.phone,
        totalSales,
        salesCount,
        commission
      }
    })
  )

  // Filter out null values and sort by total sales
  return agentsWithDetails
    .filter(agent => agent !== null)
    .sort((a, b) => b!.totalSales - a!.totalSales)
    .slice(0, 10)
}

async function getRecentActivity(startDate: Date, endDate: Date, whereClause: any) {
  const activities = []

  // Get recent voucher sales
  const recentVouchers = await prisma.voucher.findMany({
    where: {
      status: { in: ['SOLD', 'REDEEMED'] },
      createdAt: { gte: startDate, lte: endDate }
    },
    select: {
      id: true,
      voucherNumber: true,
      status: true,
      createdAt: true,
      location: {
        select: {
          name: true,
          town: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate }
    },
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      buyerName: true,
      buyerEmail: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  // Get recent agent sales
  const recentAgentSales = await prisma.agentSale.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate }
    },
    select: {
      id: true,
      soldPrice: true,
      createdAt: true,
      agent: {
        select: {
          displayName: true
        }
      },
      voucher: {
        select: {
          location: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  // Convert to activity format
  recentVouchers.forEach(voucher => {
    activities.push({
      id: `voucher-${voucher.id}`,
      type: 'voucher',
      icon: voucher.status === 'REDEEMED' ? 'check_circle' : 'shopping_cart',
      message: `Voucher ${voucher.voucherNumber} ${voucher.status === 'REDEEMED' ? 'redeemed' : 'sold'}`,
      timestamp: voucher.createdAt,
      location: voucher.location.name,
      amount: null
    })
  })

  recentOrders.forEach(order => {
    activities.push({
      id: `order-${order.id}`,
      type: 'order',
      icon: 'receipt',
      message: `Order ${order.status} for ${order.buyerName || order.buyerEmail || 'Anonymous'}`,
      timestamp: order.createdAt,
      location: 'Online',
      amount: Number(order.total)
    })
  })

  recentAgentSales.forEach(sale => {
    activities.push({
      id: `agent-${sale.id}`,
      type: 'agent_sale',
      icon: 'store',
      message: `Agent ${sale.agent.displayName} sold voucher for $${sale.soldPrice}`,
      timestamp: sale.createdAt,
      location: sale.voucher.location.name,
      amount: Number(sale.soldPrice)
    })
  })

  // Sort by timestamp and return top 20
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)
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
