import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, otpCode } = body

    // Validation
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!otpCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OTP code is required'
      })
    }

    if (!/^\d{6}$/.test(otpCode)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OTP code must be 6 digits'
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email or OTP code'
      })
    }

    // Check if user is suspended or blacklisted
    if (user.isSuspended || user.isBlacklisted) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is restricted. Please contact support.'
      })
    }

    // Check if OTP exists and is not expired
    if (!user.otpCode || !user.otpExpiresAt) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid OTP found. Please request a new code.'
      })
    }

    const now = new Date()
    if (now > user.otpExpiresAt) {
      // Clear expired OTP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: null,
          otpExpiresAt: null
        }
      })
      
      throw createError({
        statusCode: 400,
        statusMessage: 'OTP code has expired. Please request a new code.'
      })
    }

    // Check OTP attempts
    if (user.otpAttempts >= 5) {
      const lockoutTime = 15 * 60 * 1000 // 15 minutes
      const lastOtpSentAt = user.lastOtpSentAt
      const timeSinceLastAttempt = lastOtpSentAt ? now.getTime() - lastOtpSentAt.getTime() : Infinity
      
      if (timeSinceLastAttempt < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - timeSinceLastAttempt) / 1000 / 60)
        throw createError({
          statusCode: 429,
          statusMessage: `Too many attempts. Please wait ${remainingTime} minutes before trying again`
        })
      } else {
        // Reset attempts after lockout period
        await prisma.user.update({
          where: { id: user.id },
          data: { otpAttempts: 0 }
        })
      }
    }

    // Verify OTP
    if (user.otpCode !== otpCode) {
      // Increment attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpAttempts: user.otpAttempts + 1
        }
      })
      
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid OTP code'
      })
    }

    // OTP is valid - clear it and reset attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0
      }
    })

    return {
      success: true,
      message: 'OTP verified successfully'
    }

  } catch (error: any) {
    console.error('OTP verification error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
