import { PrismaClient } from '@prisma/client'

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

    // Get ad ID from route params
    const adId = getRouterParam(event, 'id')

    if (!adId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ad ID is required'
      })
    }

    // Check if ad exists
    const existingAd = await prisma.ad.findUnique({
      where: { id: adId }
    })

    if (!existingAd) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ad not found'
      })
    }

    // Delete ad in a transaction (this will cascade delete location links)
    await prisma.$transaction(async (tx) => {
      // Delete the ad (location links will be deleted automatically due to cascade)
      await tx.ad.delete({
        where: { id: adId }
      })
    })

    return {
      success: true,
      message: 'Ad deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting ad:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
