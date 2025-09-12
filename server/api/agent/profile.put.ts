import { PrismaClient } from '@prisma/client'

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
    const { displayName, email, phone, defaultDiscountPct, cashOnly } = body

    // Validate required fields
    if (!displayName || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Display name and email are required'
      })
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Email is already taken by another user'
        })
      }
    }

    // Check if phone is already taken by another user
    if (phone && phone !== session.user.phone) {
      const existingUser = await prisma.user.findUnique({
        where: { phone }
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Phone number is already taken by another user'
        })
      }
    }

    // Update user information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email,
        phone,
        updatedAt: new Date()
      }
    })

    // Update agent profile
    await prisma.agentProfile.update({
      where: { id: agentProfile.id },
      data: {
        displayName,
        defaultDiscountPct: Number(defaultDiscountPct) || 0,
        cashOnly: Boolean(cashOnly),
        updatedAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Profile updated successfully'
    }

  } catch (error: any) {
    console.error('Error updating agent profile:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
