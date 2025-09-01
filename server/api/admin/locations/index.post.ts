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

    // Get request body
    const body = await readBody(event)
    const {
      name,
      code,
      town,
      area,
      province,
      routerModel,
      ssid,
      latitude,
      longitude,
      notes
    } = body

    // Validate required fields
    if (!name || !code || !town || !province) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, code, town, and province are required'
      })
    }

    // Check if location code already exists
    const existingLocation = await prisma.location.findUnique({
      where: { code }
    })

    if (existingLocation) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location code already exists'
      })
    }

    // Prepare meta data
    const meta: any = {}
    if (routerModel) meta.routerModel = routerModel
    if (ssid) meta.ssid = ssid
    if (notes) meta.notes = notes

    // Create location
    const location = await prisma.location.create({
      data: {
        name,
        code,
        town,
        area,
        province,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        meta: Object.keys(meta).length > 0 ? meta : null
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
      status: 'ACTIVE',
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
      message: 'Location created successfully',
      location: transformedLocation
    }

  } catch (error) {
    console.error('Error creating location:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create location'
    })
  }
})
