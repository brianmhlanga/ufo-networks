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

    // Get payment statistics
    const [
      totalPayments,
      totalAmount,
      paymentsByStatus,
      paymentsByProvider,
      recentPayments,
      failedPayments
    ] = await Promise.all([
      // Total payments count
      prisma.payment.count({ where: dateFilter }),
      
      // Total amount
      prisma.payment.aggregate({
        where: dateFilter,
        _sum: { amount: true }
      }),
      
      // Payments by status
      prisma.payment.groupBy({
        by: ['status'],
        where: dateFilter,
        _count: { status: true },
        _sum: { amount: true }
      }),
      
      // Payments by provider
      prisma.payment.groupBy({
        by: ['provider'],
        where: dateFilter,
        _count: { provider: true },
        _sum: { amount: true }
      }),
      
      // Recent payments (last 5)
      prisma.payment.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              buyerName: true,
              buyerEmail: true,
              total: true
            }
          }
        }
      }),
      
      // Failed payments count
      prisma.payment.count({
        where: {
          ...dateFilter,
          status: 'FAILED'
        }
      })
    ])

    // Calculate status percentages and amounts
    const statusBreakdown = paymentsByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
      amount: item._sum.amount || 0,
      percentage: totalPayments > 0 ? Math.round((item._count.status / totalPayments) * 100) : 0
    }))

    // Calculate provider breakdown
    const providerBreakdown = paymentsByProvider.map(item => ({
      provider: item.provider,
      count: item._count.provider,
      amount: item._sum.amount || 0,
      percentage: totalPayments > 0 ? Math.round((item._count.provider / totalPayments) * 100) : 0
    }))

    // Calculate success rate
    const successfulPayments = paymentsByStatus
      .filter(item => ['PAID', 'AUTHORIZED'].includes(item.status))
      .reduce((sum, item) => sum + item._count.status, 0)
    
    const successRate = totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0

    return {
      success: true,
      stats: {
        totalPayments,
        totalAmount: totalAmount._sum.amount || 0,
        averagePaymentAmount: totalPayments > 0 ? (totalAmount._sum.amount || 0) / totalPayments : 0,
        statusBreakdown,
        providerBreakdown,
        successRate,
        failedPayments,
        recentPayments
      }
    }
  } catch (error) {
    console.error('Error fetching payment stats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
