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

    // Get agent statistics
    const [
      totalAgents,
      activeAgents,
      blacklistedAgents,
      salesRevenue,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: 'AGENT' },
      }),
      prisma.user.count({
        where: {
          role: 'AGENT',
          status: 'ACTIVE',
        },
      }),
      prisma.user.count({
        where: {
          role: 'AGENT',
          status: 'BLACKLISTED',
        },
      }),
      prisma.agentSale.aggregate({
        _sum: { soldPrice: true },
      }),
    ])

    const totalSales = Number(salesRevenue._sum.soldPrice || 0)

    return {
      totalAgents,
      activeAgents,
      blacklistedAgents,
      totalSales,
    }
  } catch (error) {
    console.error('Error fetching agent stats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
