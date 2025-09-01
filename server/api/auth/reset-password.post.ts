import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { sendPasswordResetConfirmationEmail } from '~/server/email/emailService'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, newPassword } = body

    // Validation
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password is required'
      })
    }

    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email'
      })
    }

    // Check if user is suspended or blacklisted
    if (user.isSuspended || user.isBlacklisted) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is restricted. Please contact support.'
      })
    }

    // Check if OTP was recently verified (within last 10 minutes)
    // This ensures the user went through the OTP verification process
    const now = new Date()
    const lastOtpSentAt = user.lastOtpSentAt
    const timeSinceOtp = lastOtpSentAt ? now.getTime() - lastOtpSentAt.getTime() : Infinity
    const otpVerificationWindow = 10 * 60 * 1000 // 10 minutes

    if (timeSinceOtp > otpVerificationWindow) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OTP verification expired. Please request a new code.'
      })
    }

    // Check if OTP was cleared (indicating successful verification)
    if (user.otpCode !== null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OTP verification required. Please verify your code first.'
      })
    }

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update user password and clear OTP-related fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        lastOtpSentAt: null
      }
    })

    // Send confirmation email
    try {
      await sendPasswordResetConfirmationEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`
      })
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return {
      success: true,
      message: 'Password reset successfully'
    }

  } catch (error: any) {
    console.error('Reset password error:', error)
    
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
