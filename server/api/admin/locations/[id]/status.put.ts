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

    // Get request body
    const body = await readBody(event)
    const { status } = body

    // Validate status
    if (!status || !['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid status is required (ACTIVE, INACTIVE, or MAINTENANCE)'
      })
    }

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id }
    })

    if (!existingLocation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found'
      })
    }

    // Update location status in meta
    const currentMeta = existingLocation.meta as any || {}
    const updatedMeta = {
      ...currentMeta,
      status: status
    }

    // Update location
    const location = await prisma.location.update({
      where: { id },
      data: {
        meta: updatedMeta
      },
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

    // Transform response
    const transformedLocation = {
      id: location.id,
      name: location.name,
      code: location.code,
      town: location.town || '',
      area: location.area || '',
      province: location.province || '',
      status: status, // Use the new status
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
      message: 'Location status updated successfully',
      location: transformedLocation
    }

  } catch (error) {
    console.error('Error updating location status:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update location status'
    })
  }
})
