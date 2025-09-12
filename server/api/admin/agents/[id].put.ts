import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

    // Get request body
    const body = await readBody(event)
    const { name, email, phone, password, agentProfile } = body

    // Validation
    if (!name || !email || !phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, and phone are required'
      })
    }

    if (!agentProfile?.displayName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent display name is required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Check if email already exists (excluding current agent)
    const existingUser = await prisma.user.findUnique({
      where: { 
        email,
        NOT: { id: agentId }
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already exists'
      })
    }

    // Check if agent exists
    const existingAgent = await prisma.user.findUnique({
      where: { 
        id: agentId,
        role: 'AGENT'
      },
      include: { agentProfile: true }
    })

    if (!existingAgent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent not found'
      })
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      phone
    }

    // Hash new password if provided
    if (password) {
      if (password.length < 6) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Password must be at least 6 characters long'
        })
      }
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    // Update user and agent profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the user
      const updatedUser = await tx.user.update({
        where: { id: agentId },
        data: updateData
      })

      // Update or create the agent profile
      let updatedAgentProfile
      if (existingAgent.agentProfile) {
        updatedAgentProfile = await tx.agentProfile.update({
          where: { userId: agentId },
          data: {
            displayName: agentProfile.displayName,
            defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
            cashOnly: agentProfile.cashOnly !== false,
            locationId: agentProfile.locationId || null
          }
        })
      } else {
        updatedAgentProfile = await tx.agentProfile.create({
          data: {
            userId: agentId,
            displayName: agentProfile.displayName,
            defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
            cashOnly: agentProfile.cashOnly !== false,
            locationId: agentProfile.locationId || null
          }
        })
      }

      return { user: updatedUser, agentProfile: updatedAgentProfile }
    })

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = result.user

    return {
      success: true,
      message: 'Agent updated successfully',
      user: userWithoutPassword,
      agentProfile: result.agentProfile
    }
  } catch (error) {
    console.error('Error updating agent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
