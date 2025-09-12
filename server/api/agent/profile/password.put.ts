import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getUserSession(event)
    
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Agent profile not found'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { currentPassword, newPassword } = body

    // Validate required fields
    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password and new password are required'
      })
    }

    // Validate new password length
    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must be at least 8 characters long'
      })
    }

    // Get user with current password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Verify current password
    if (!user.passwordHash) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password verification failed'
      })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password is incorrect'
      })
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Password updated successfully'
    }

  } catch (error: any) {
    console.error('Error updating password:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
