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

    // Get order statistics
    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      topLocations
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({ where: dateFilter }),
      
      // Total revenue
      prisma.order.aggregate({
        where: dateFilter,
        _sum: { total: true }
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        where: dateFilter,
        _count: { status: true }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          buyerName: true,
          buyerEmail: true,
          createdAt: true
        }
      }),
      
      // Top locations by order count
      prisma.orderItem.groupBy({
        by: ['locationId'],
        where: {
          ...dateFilter,
          locationId: { not: null }
        },
        _count: { locationId: true },
        _sum: { lineTotal: true },
        orderBy: { _count: { locationId: 'desc' } },
        take: 5
      })
    ])

    // Get location names for top locations
    const locationIds = topLocations.map(item => item.locationId).filter(Boolean)
    const locations = await prisma.location.findMany({
      where: { id: { in: locationIds } },
      select: { id: true, name: true, code: true }
    })

    // Map location data
    const topLocationsWithNames = topLocations.map(item => {
      const location = locations.find(loc => loc.id === item.locationId)
      return {
        locationId: item.locationId,
        locationName: location?.name || 'Unknown',
        locationCode: location?.code || 'Unknown',
        orderCount: item._count.locationId,
        totalRevenue: item._sum.lineTotal || 0
      }
    })

    // Calculate status percentages
    const statusBreakdown = ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
      percentage: totalOrders > 0 ? Math.round((item._count.status / totalOrders) * 100) : 0
    }))

    return {
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0,
        statusBreakdown,
        recentOrders,
        topLocations: topLocationsWithNames
      }
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
