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
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string
    const advertiserId = query.advertiserId as string
    const placementPage = query.placementPage as string
    const active = query.active as string
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { htmlSnippet: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (advertiserId) {
      where.advertiserId = advertiserId
    }
    
    if (placementPage) {
      where.placementPage = placementPage
    }
    
    if (active !== undefined && active !== '') {
      where.active = active === 'true'
    }
    
    if (dateFrom || dateTo) {
      where.startsAt = {}
      if (dateFrom) {
        where.startsAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.startsAt.lte = new Date(dateTo)
      }
    }

    // Fetch ads with pagination
    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.ad.count({ where })
    ])

    return {
      success: true,
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching ads:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
