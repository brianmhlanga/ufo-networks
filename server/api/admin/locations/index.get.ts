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

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string || ''
    const province = query.province as string || ''
    const status = query.status as string || ''
    const sortBy = query.sortBy as string || 'createdAt'
    const sortOrder = query.sortOrder as string || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { town: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (province) {
      where.province = province
    }

    // Filter by status from meta field
    if (status) {
      if (status === 'ACTIVE') {
        where.meta = {
          path: ['status'],
          equals: 'ACTIVE'
        }
      } else if (status === 'INACTIVE') {
        where.meta = {
          path: ['status'],
          equals: 'INACTIVE'
        }
      } else if (status === 'MAINTENANCE') {
        where.meta = {
          path: ['status'],
          equals: 'MAINTENANCE'
        }
      }
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Fetch locations with voucher counts
    const [locations, totalLocations] = await Promise.all([
      prisma.location.findMany({
        where,
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
        },
        orderBy,
        skip,
        take
      }),
      prisma.location.count({ where })
    ])

    // Transform data to match frontend expectations
    const transformedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      code: location.code,
      town: location.town || '',
      area: location.area || '',
      province: location.province || '',
      status: location.meta?.status || (location._count.vouchers > 0 ? 'ACTIVE' : 'INACTIVE'),
      voucherCount: location._count.vouchers,
      routerModel: location.meta?.routerModel || '',
      ssid: location.meta?.ssid || '',
      coordinates: location.latitude && location.longitude 
        ? { lat: location.latitude, lng: location.longitude }
        : null,
      notes: location.meta?.notes || '',
      createdAt: location.createdAt,
      updatedAt: location.updatedAt
    }))

    return {
      locations: transformedLocations,
      pagination: {
        page,
        limit,
        total: totalLocations,
        totalPages: Math.ceil(totalLocations / limit)
      }
    }

  } catch (error) {
    console.error('Error fetching locations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch locations'
    })
  }
})
