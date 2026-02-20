import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    console.log('[auth/login] Attempt:', email ? `${email.slice(0, 3)}***` : '(no email)')

    if (!email || !password) {
      console.log('[auth/login] Rejected: missing email or password')
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
      console.log('[auth/login] Rejected: user not found')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    // Check if user has password hash
    if (!user.passwordHash) {
      console.log('[auth/login] Rejected: no password hash for user')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      console.log('[auth/login] Rejected: invalid password')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }

    console.log('[auth/login] Password OK, setting session for role:', user.role)

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

    console.log('[auth/login] Session set, returning success. Redirect target:', user.role === 'AGENT' ? '/agent' : ['SUPER_ADMIN', 'ADMIN'].includes(user.role) ? '/admin' : '/user')

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
    console.error('[auth/login] Error:', error?.statusCode || error?.message || error)
    
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