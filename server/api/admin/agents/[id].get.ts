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
        agentProfile: {
          include: {
            _count: {
              select: {
                sales: true
              }
            }
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

    // Calculate stats from actual agent sales
    const agentProfileId = agent.agentProfile?.id
    const salesStats = agentProfileId
      ? await prisma.agentSale.aggregate({
          where: { agentId: agentProfileId },
          _sum: { soldPrice: true },
          _count: { id: true },
        })
      : { _sum: { soldPrice: null }, _count: { id: 0 } }

    const totalSales = Number(salesStats._sum.soldPrice || 0)
    const totalVouchers = salesStats._count.id

    const recentSales = agentProfileId
      ? await prisma.agentSale.findMany({
          where: { agentId: agentProfileId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            voucher: {
              select: { voucherNumber: true },
            },
          },
        })
      : []

    const recentActivity = recentSales.map((sale) => ({
      id: sale.id,
      icon: 'sell',
      description: `Sold voucher ${sale.voucher?.voucherNumber || 'N/A'} for $${Number(sale.soldPrice).toFixed(2)}`,
      createdAt: sale.createdAt.toISOString(),
    }))

    // Remove password hash from response
    const { passwordHash: _, ...agentWithoutPassword } = agent

    return {
      success: true,
      agent: {
        ...agentWithoutPassword,
        agentStats: {
          totalSales,
          totalVouchers,
          totalCommission: 0,
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
