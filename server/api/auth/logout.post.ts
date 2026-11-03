import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Clear the user session
    await clearUserSession(event)
    
    return {
      success: true,
      message: 'Logout successful'
    }
  } catch (error) {
    console.error('Logout error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error.'
    })
  }
}) 