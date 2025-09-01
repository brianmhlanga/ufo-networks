import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is admin
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required'
      })
    }

    // Get location ID from params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required'
      })
    }

    // Fetch location with voucher counts
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            vouchers: {
              where: {
                status: 'AVAILABLE'
              }
            }
          }
        }
      }
    })

    if (!location) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found'
      })
    }

    // Transform response
    const transformedLocation = {
      id: location.id,
      name: location.name,
      code: location.code,
      town: location.town || '',
      area: location.area || '',
      province: location.province || '',
      status: location._count.vouchers > 0 ? 'ACTIVE' : 'INACTIVE',
      voucherCount: location._count.vouchers,
      routerModel: location.meta?.routerModel || '',
      ssid: location.meta?.ssid || '',
      coordinates: location.latitude && location.longitude 
        ? { lat: location.latitude, lng: location.longitude }
        : null,
      notes: location.meta?.notes || '',
      createdAt: location.createdAt,
      updatedAt: location.updatedAt
    }

    return {
      location: transformedLocation
    }

  } catch (error) {
    console.error('Error fetching location:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch location'
    })
  }
})
