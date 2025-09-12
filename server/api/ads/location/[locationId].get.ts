import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const locationId = getRouterParam(event, 'locationId')
    
    if (!locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required'
      })
    }

    const now = new Date()

    // Fetch active ads for this location
    const ads = await prisma.ad.findMany({
      where: {
        active: true,
        placementPage: 'SUCCESS',
        startsAt: {
          lte: now
        },
        OR: [
          {
            endsAt: null // No end date
          },
          {
            endsAt: {
              gte: now
            }
          }
        ],
        locations: {
          some: {
            locationId: locationId
          }
        }
      },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: ads
    }

  } catch (error: any) {
    console.error('Error fetching location ads:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
