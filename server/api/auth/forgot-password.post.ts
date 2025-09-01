import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { sendPasswordResetEmail } from '~/server/email/emailService'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    // Validation
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If an account with this email exists, a reset code has been sent'
      }
    }

    // Check if user is suspended or blacklisted
    if (user.isSuspended || user.isBlacklisted) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is restricted. Please contact support.'
      })
    }

    // Check if OTP was sent recently (rate limiting)
    const now = new Date()
    const lastOtpSentAt = user.lastOtpSentAt
    const timeSinceLastOtp = lastOtpSentAt ? now.getTime() - lastOtpSentAt.getTime() : Infinity
    const minInterval = 60 * 1000 // 1 minute

    if (timeSinceLastOtp < minInterval) {
      const remainingTime = Math.ceil((minInterval - timeSinceLastOtp) / 1000)
      throw createError({
        statusCode: 429,
        statusMessage: `Please wait ${remainingTime} seconds before requesting another code`
      })
    }

    // Check OTP attempts (prevent abuse)
    if (user.otpAttempts >= 5) {
      const lockoutTime = 15 * 60 * 1000 // 15 minutes
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

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 minutes

    // Update user with OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiresAt,
        lastOtpSentAt: now,
        otpAttempts: 0 // Reset attempts on new OTP
      }
    })

    // Send email
    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        otpCode
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return {
      success: true,
      message: 'If an account with this email exists, a reset code has been sent'
    }

  } catch (error: any) {
    console.error('Forgot password error:', error)
    
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
