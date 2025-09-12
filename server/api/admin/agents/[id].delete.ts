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

    // Check if agent exists and is an agent
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

    // Check for associated data
    if ((agent.agentProfile?._count?.sales || 0) > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete agent with existing sales records'
      })
    }

    // Prevent deleting the currently logged-in user
    if (agentId === (session.user as any).id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Delete agent and related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete agent profile if it exists
      if (agent.agentProfile) {
        await tx.agentProfile.delete({
          where: { userId: agentId }
        })
      }

      // Delete the user
      await tx.user.delete({
        where: { id: agentId }
      })
    })

    return {
      success: true,
      message: 'Agent deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting agent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
