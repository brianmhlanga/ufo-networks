import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { normalizeZimbabwePhone } from '~/utils/phone'

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

    if (!user || (user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Super Admin access required (Admin is view-only)'
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

    // Normalise the phone so 0771234567 and +263771234567 cannot both be stored as
    // "different" users — User.phone is unique.
    const normalizedPhone = normalizeZimbabwePhone(phone)

    if (!normalizedPhone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Enter a valid Zimbabwean mobile number, e.g. 077 123 4567'
      })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A user with this email address already exists'
      })
    }

    // User.phone is unique too. Without this check a phone already held by any user (e.g. a past
    // customer checkout) fails as a bare Prisma P2002 and surfaces as an opaque 500.
    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone }
    })

    if (existingPhone) {
      throw createError({
        statusCode: 400,
        statusMessage: `A user with the phone number ${normalizedPhone} already exists`
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
          phone: normalizedPhone,
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
  } catch (error: any) {
    console.error('Error creating agent:', error)

    if (error.statusCode) {
      throw error
    }

    // Unique constraint — name the field rather than returning a bare 500.
    if (error.code === 'P2002') {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target.join(', ')
        : error.meta?.target || 'field'
      throw createError({
        statusCode: 400,
        statusMessage: `An account with this ${field} already exists`
      })
    }

    // Foreign key — e.g. a stale location id from the dropdown.
    if (error.code === 'P2003') {
      throw createError({
        statusCode: 400,
        statusMessage: 'The selected location no longer exists. Refresh the page and try again.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
