import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const locationCode = getRouterParam(event, 'code')
    
    if (!locationCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location code is required'
      })
    }

    const now = new Date()

    // First, find the location by code to get its ID
    const location = await prisma.location.findUnique({
      where: {
        code: locationCode
      },
      select: {
        id: true
      }
    })

    if (!location) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found'
      })
    }

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
            locationId: location.id
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
    console.error('Error fetching location ads by code:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
