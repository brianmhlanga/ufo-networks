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

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string || ''
    const locationId = query.locationId as string || ''
    const active = query.active === 'true' ? true : query.active === 'false' ? false : null
    const sortBy = query.sortBy as string || ''
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc'

    // Calculate offset
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { name: { contains: search } } }
      ]
    }
    
    if (locationId) {
      where.locationId = locationId
    }
    
    if (active !== null) {
      where.active = active
    }

    // Whitelist of sortable columns → Prisma orderBy. Never interpolate a client-supplied field
    // name straight into orderBy. `vouchers` is a relation count and `location` is nested, so both
    // need their own shape.
    const sortMap: Record<string, any> = {
      name: { name: sortOrder },
      retailPrice: { retailPrice: sortOrder },
      hours: { hours: sortOrder },
      numberOfUsers: { numberOfUsers: sortOrder },
      dataLimitGb: { dataLimitGb: sortOrder },
      vouchers: { vouchers: { _count: sortOrder } },
      startDate: { startDate: sortOrder },
      endDate: { endDate: sortOrder },
      active: { active: sortOrder },
      createdAt: { createdAt: sortOrder },
      'location.name': { location: { name: sortOrder } },
    }

    const orderBy = sortMap[sortBy] || { createdAt: 'desc' }

    // Get total count
    const total = await prisma.voucherBatch.count({ where })

    // Get batches with pagination
    const batches = await prisma.voucherBatch.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: {
            vouchers: true
          }
        }
      },
      orderBy,
      skip: offset,
      take: limit
    })

    return {
      success: true,
      batches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

  } catch (error) {
    console.error('Error fetching batches:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
