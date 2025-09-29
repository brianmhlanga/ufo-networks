import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is admin
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required'
      })
    }

    // Get user ID from params
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { name, email, phone, role, password, agentProfile } = body

    // Validation
    if (!name || !email || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, role'
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Check if email already exists (excluding current user)
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId }
      }
    })

    if (emailExists) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email already exists'
      })
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      phone: phone || null,
      role
    }

    // Hash password if provided
    if (password) {
      if (password.length < 6) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Password must be at least 6 characters long'
        })
      }
      updateData.passwordHash = await bcrypt.hash(password, 12)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        agentProfile: true
      }
    })

    // Handle agent profile
    if (role === 'AGENT' && agentProfile) {
      if (updatedUser.agentProfile) {
        // Update existing agent profile
        await prisma.agentProfile.update({
          where: { id: updatedUser.agentProfile.id },
          data: {
            displayName: agentProfile.displayName,
            defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
            cashOnly: agentProfile.cashOnly !== false
          }
        })
      } else {
        // Create new agent profile
        await prisma.agentProfile.create({
          data: {
            userId: userId,
            displayName: agentProfile.displayName,
            defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
            cashOnly: agentProfile.cashOnly !== false
          }
        })
      }
    } else if (role !== 'AGENT' && updatedUser.agentProfile) {
      // Delete agent profile if user is no longer an agent
      await prisma.agentProfile.delete({
        where: { id: updatedUser.agentProfile.id }
      })
    }

    // Get updated user with agent profile
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        agentProfile: true
      }
    })

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = finalUser!

    return {
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
