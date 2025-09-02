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

    // Get current date and calculate previous period for growth comparison
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Fetch dashboard statistics
    const [
      totalUsers,
      previousTotalUsers,
      activeVouchers,
      previousActiveVouchers,
      totalRevenue,
      previousTotalRevenue,
      activeLocations,
      recentOrders,
      recentUsers,
      voucherStatusDistribution
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { lt: thirtyDaysAgo } }
      }),
      // Active vouchers (available and reserved)
      prisma.voucher.count({
        where: { status: { in: ['AVAILABLE', 'RESERVED'] } }
      }),
      prisma.voucher.count({
        where: { 
          status: { in: ['AVAILABLE', 'RESERVED'] },
          createdAt: { lt: thirtyDaysAgo }
        }
      }),
      // Total revenue (orders + agent sales)
      prisma.$transaction([
        prisma.order.aggregate({
          where: { status: 'PAID' },
          _sum: { total: true }
        }),
        prisma.agentSale.aggregate({
          _sum: { soldPrice: true }
        })
      ]),
      prisma.$transaction([
        prisma.order.aggregate({
          where: { 
            status: 'PAID',
            createdAt: { lt: thirtyDaysAgo }
          },
          _sum: { total: true }
        }),
        prisma.agentSale.aggregate({
          where: { createdAt: { lt: thirtyDaysAgo } },
          _sum: { soldPrice: true }
        })
      ]),
      // Active locations (locations with available vouchers)
      prisma.location.count({
        where: { vouchers: { some: { status: { in: ['AVAILABLE', 'RESERVED'] } } } }
      }),
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            select: { quantity: true }
          }
        }
      }),
      // Recent users
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      }),
      // Voucher status distribution
      prisma.voucher.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ])

    // Calculate revenue totals
    const currentRevenue = Number(totalRevenue[0]._sum.total || 0) + Number(totalRevenue[1]._sum.soldPrice || 0)
    const previousRevenue = Number(previousTotalRevenue[0]._sum.total || 0) + Number(previousTotalRevenue[1]._sum.soldPrice || 0)

    // Calculate growth percentages
    const userGrowth = previousTotalUsers > 0 
      ? Math.round(((totalUsers - previousTotalUsers) / previousTotalUsers) * 100) 
      : 0

    const voucherGrowth = previousActiveVouchers > 0 
      ? Math.round(((activeVouchers - previousActiveVouchers) / previousActiveVouchers) * 100) 
      : 0

    const revenueGrowth = previousRevenue > 0 
      ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) 
      : 0

    // Format recent orders
    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      customerName: order.user?.name || 'Unknown User',
      items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      amount: Number(order.total),
      status: order.status,
      timeAgo: formatTimeAgo(order.createdAt)
    }))

    // Format recent users
    const formattedUsers = recentUsers.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email || 'No email',
      role: user.role,
      timeAgo: formatTimeAgo(user.createdAt)
    }))

    // Format voucher status distribution for chart
    const voucherChartData = {
      labels: voucherStatusDistribution.map(item => item.status),
      data: voucherStatusDistribution.map(item => item._count.id)
    }

    return {
      success: true,
      stats: {
        totalUsers,
        userGrowth,
        activeVouchers,
        voucherGrowth,
        totalRevenue: currentRevenue,
        revenueGrowth,
        activeLocations
      },
      recentOrders: formattedOrders,
      recentUsers: formattedUsers,
      voucherChartData
    }

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard data'
    })
  }
})

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}
