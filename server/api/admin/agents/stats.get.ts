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
      blacklistedAgents
    ] = await Promise.all([
      // Total agents
      prisma.user.count({
        where: { role: 'AGENT' }
      }),
      // Active agents
      prisma.user.count({
        where: { 
          role: 'AGENT',
          status: 'ACTIVE'
        }
      }),
      // Blacklisted agents
      prisma.user.count({
        where: { 
          role: 'AGENT',
          status: 'BLACKLISTED'
        }
      })
    ])

    // Calculate total sales (placeholder - in real app this would come from actual sales data)
    const totalSales = Math.random() * 100000 // Placeholder value

    return {
      totalAgents,
      activeAgents,
      blacklistedAgents,
      totalSales: Math.round(totalSales)
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
