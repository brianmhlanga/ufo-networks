import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const adId = getRouterParam(event, 'id')
    
    if (!adId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ad ID is required'
      })
    }

    // Increment click count for the ad
    const updatedAd = await prisma.ad.update({
      where: {
        id: adId
      },
      data: {
        clicks: {
          increment: 1
        }
      },
      select: {
        id: true,
        title: true,
        clicks: true
      }
    })

    return {
      success: true,
      data: updatedAd
    }

  } catch (error: any) {
    console.error('Error tracking ad click:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
