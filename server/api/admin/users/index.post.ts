import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is admin
    const session = await getUserSession(event)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Super Admin access required (Admin is view-only)'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { name, email, phone, role, password, agentProfile } = body

    // Validation
    if (!name || !email || !role || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, role, password'
      })
    }

    // Admins may only create staff/agent accounts. Customers come from public checkout, not here.
    const CREATABLE_ROLES = ['AGENT', 'ADMIN', 'SUPER_ADMIN']
    if (!CREATABLE_ROLES.includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role. Choose Agent, Admin, or Super Admin.'
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

    // Validate password length
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role,
        passwordHash: hashedPassword,
        agentProfile: role === 'AGENT' && agentProfile ? {
          create: {
            displayName: agentProfile.displayName,
            defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
            cashOnly: agentProfile.cashOnly !== false
          }
        } : undefined
      },
      include: {
        agentProfile: true
      }
    })

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = newUser

    return {
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
