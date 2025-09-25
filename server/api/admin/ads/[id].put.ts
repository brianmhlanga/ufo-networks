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

    // Get request body
    const body = await readBody(event)
    const { 
      advertiserId, 
      title, 
      mediaUrl, 
      targetUrl, 
      htmlSnippet, 
      placementPage, 
      startsAt, 
      endsAt, 
      active,
      locationIds
    } = body

    // Validation
    if (!title || !placementPage || !startsAt) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, placement page, and start date are required'
      })
    }


    if (endsAt && startsAt && new Date(endsAt) <= new Date(startsAt)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'End date must be after start date'
      })
    }

    // Validate advertiser exists if provided
    if (advertiserId) {
      const advertiser = await prisma.advertiser.findUnique({
        where: { id: advertiserId }
      })

      if (!advertiser) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid advertiser ID'
        })
      }
    }

    // Update ad in a transaction
    const updatedAd = await prisma.$transaction(async (tx) => {
      // Update the ad
      const ad = await tx.ad.update({
        where: { id: adId },
        data: {
          advertiserId: advertiserId || null,
          title,
          mediaUrl: mediaUrl || null,
          targetUrl: targetUrl || null,
          htmlSnippet: htmlSnippet || null,
          placementPage,
          startsAt: new Date(startsAt),
          endsAt: endsAt ? new Date(endsAt) : null,
          active: active !== undefined ? active : true
        }
      })

      // Update location links if provided
      if (locationIds !== undefined) {
        // Remove existing location links
        await tx.adLocationLink.deleteMany({
          where: { adId }
        })

        // Create new location links if provided
        if (Array.isArray(locationIds) && locationIds.length > 0) {
          // Validate locations exist
          const locations = await tx.location.findMany({
            where: { id: { in: locationIds } }
          })

          if (locations.length !== locationIds.length) {
            throw createError({
              statusCode: 400,
              statusMessage: 'One or more location IDs are invalid'
            })
          }

          // Create location links
          await tx.adLocationLink.createMany({
            data: locationIds.map(locationId => ({
              adId,
              locationId
            }))
          })
        }
      }

      return ad
    })

    // Fetch the updated ad with all related data
    const adWithDetails = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true
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
                province: true
              }
            }
          }
        }
      }
    })

    return {
      success: true,
      message: 'Ad updated successfully',
      ad: adWithDetails
    }
  } catch (error) {
    console.error('Error updating ad:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
