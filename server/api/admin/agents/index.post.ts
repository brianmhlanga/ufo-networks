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

    // Get request body
    const body = await readBody(event)
    const { name, email, phone, password, agentProfile } = body

    // Validation
    if (!name || !email || !phone || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, phone, and password are required'
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
        statusMessage: 'Email already exists'
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user and agent profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: 'AGENT',
          status: 'ACTIVE'
        }
      })

      // Create the agent profile
      const newAgentProfile = await tx.agentProfile.create({
        data: {
          userId: newUser.id,
          displayName: agentProfile.displayName,
          defaultDiscountPct: agentProfile.defaultDiscountPct || 0,
          cashOnly: agentProfile.cashOnly !== false,
          locationId: agentProfile.locationId || null
        }
      })

      return { user: newUser, agentProfile: newAgentProfile }
    })

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = result.user

    return {
      success: true,
      message: 'Agent created successfully',
      user: userWithoutPassword,
      agentProfile: result.agentProfile
    }
  } catch (error) {
    console.error('Error creating agent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
