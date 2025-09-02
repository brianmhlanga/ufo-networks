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

    // Fetch ad with all related data
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            meta: true
          }
        },
        locations: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                code: true,
                town: true,
                area: true,
                province: true,
                latitude: true,
                longitude: true
              }
            }
          }
        }
      }
    })

    if (!ad) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ad not found'
      })
    }

    return {
      success: true,
      ad
    }
  } catch (error) {
    console.error('Error fetching ad:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
