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

    // Check if agent exists and is an agent
    const agent = await prisma.user.findUnique({
      where: { 
        id: agentId,
        role: 'AGENT'
      }
    })

    if (!agent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent not found'
      })
    }

    // Check if agent is blacklisted
    if (agent.status !== 'BLACKLISTED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent is not blacklisted'
      })
    }

    // Update agent status to active
    const updatedAgent = await prisma.user.update({
      where: { id: agentId },
      data: { status: 'ACTIVE' }
    })

    return {
      success: true,
      message: 'Agent removed from blacklist successfully',
      agent: {
        id: updatedAgent.id,
        name: updatedAgent.name,
        email: updatedAgent.email,
        status: updatedAgent.status
      }
    }
  } catch (error) {
    console.error('Error unblacklisting agent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
