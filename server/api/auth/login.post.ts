import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required.'
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        agentProfile: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    // Check if user has password hash
    if (!user.passwordHash) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    // Create session using nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        agentProfile: user.agentProfile ? {
          id: user.agentProfile.id,
          displayName: user.agentProfile.displayName,
          defaultDiscountPct: user.agentProfile.defaultDiscountPct,
          cashOnly: user.agentProfile.cashOnly
        } : null
      }
    })

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        agentProfile: user.agentProfile ? {
          id: user.agentProfile.id,
          displayName: user.agentProfile.displayName,
          defaultDiscountPct: user.agentProfile.defaultDiscountPct,
          cashOnly: user.agentProfile.cashOnly
        } : null
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error.'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 