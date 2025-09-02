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
    const status = query.status as string
    const locationId = query.locationId as string
    const batchId = query.batchId as string
    const sortBy = query.sortBy as string || 'createdAt'
    const sortOrder = query.sortOrder as string || 'desc'

    // Build where clause
    const where: any = {}

    // Add search filter
    if (search) {
      where.OR = [
        { voucherNumber: { contains: search, mode: 'insensitive' } },
        { pin: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add status filter
    if (status) {
      where.status = status
    }

    // Add location filter
    if (locationId) {
      where.locationId = locationId
    }

    // Add batch filter
    if (batchId) {
      where.batchId = batchId
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count
    const total = await prisma.voucher.count({ where })

    // Get vouchers with relations
    const vouchers = await prisma.voucher.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        batch: {
          select: {
            id: true,
            name: true
          }
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedToAgent: {
          select: {
            id: true,
            displayName: true
          }
        },
        agentSale: {
          select: {
            id: true,
            soldPrice: true,
            buyerPhone: true,
            buyerNote: true,
            createdAt: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    })

    return {
      vouchers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
