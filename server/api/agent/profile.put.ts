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

    // Get request body (allowlist only)
    const body = await readBody(event)
    const displayName = String(body?.displayName || '').trim()
    const email = String(body?.email || '').trim().toLowerCase()
    const phone = body?.phone ? String(body.phone).trim() : null
    const defaultDiscountPct = Number(body?.defaultDiscountPct || 0)
    const cashOnly = Boolean(body?.cashOnly)

    // Validate required fields
    if (!displayName || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Display name and email are required'
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please provide a valid email address'
      })
    }

    if (defaultDiscountPct < 0 || defaultDiscountPct > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Default discount must be between 0 and 100'
      })
    }

    // Ensure current user exists and role remains unchanged (role is never updated here)
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    })
    if (!currentUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Check if email is already taken by another user
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUserByEmail && existingUserByEmail.id !== session.user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is already taken by another user'
      })
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone }
      })
      if (existingUserByPhone && existingUserByPhone.id !== session.user.id) {
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
        defaultDiscountPct,
        cashOnly,
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
