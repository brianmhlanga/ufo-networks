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

    // Get agent ID from route params
    const agentId = getRouterParam(event, 'id')

    if (!agentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent ID is required'
      })
    }

    // Find the agent
    const agent = await prisma.user.findUnique({
      where: { 
        id: agentId,
        role: 'AGENT'
      },
      include: {
        agentProfile: true,
        _count: {
          select: {
            agentSales: true,
            agentPurchases: true
          }
        }
      }
    })

    if (!agent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent not found'
      })
    }

    // Calculate stats
    const totalSales = Math.random() * 10000 // Placeholder
    const totalVouchers = agent._count.agentSales || 0
    const totalCommission = totalSales * 0.1 // 10% commission placeholder

    // Get recent activity (placeholder - in real app this would come from actual activity logs)
    const recentActivity = [
      {
        id: '1',
        icon: 'sell',
        description: 'Sold 5 vouchers',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        icon: 'account_balance_wallet',
        description: 'Received commission payment',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]

    // Remove password hash from response
    const { passwordHash: _, ...agentWithoutPassword } = agent

    return {
      success: true,
      agent: {
        ...agentWithoutPassword,
        agentStats: {
          totalSales,
          totalVouchers,
          totalCommission
        },
        recentActivity
      }
    }
  } catch (error) {
    console.error('Error fetching agent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
