import { sendContactEmail } from '~/server/email/emailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { firstName, lastName, email, phone, subject, message } = body

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All required fields must be provided'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Name validation
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First and last names must be at least 2 characters'
      })
    }

    // Message validation
    if (message.trim().length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message must be at least 10 characters'
      })
    }

    if (message.trim().length > 2000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message must be less than 2000 characters'
      })
    }

    // Subject validation
    const validSubjects = [
      'general', 'business_claim', 'technical', 'account', 'billing',
      'report', 'partnership', 'feature_request', 'bug_report', 'other'
    ]

    if (!validSubjects.includes(subject)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid subject selection'
      })
    }

    // Send email
    try {
      await sendContactEmail({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        subject,
        message: message.trim()
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send message. Please try again later.'
      })
    }

    return {
      success: true,
      message: 'Message sent successfully'
    }

  } catch (error: any) {
    console.error('Contact API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
