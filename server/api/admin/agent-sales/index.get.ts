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
    const agentId = query.agentId as string
    const locationId = query.locationId as string
    const batchId = query.batchId as string
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { buyerPhone: { contains: search, mode: 'insensitive' } },
        { buyerNote: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { voucher: { voucherNumber: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (agentId) {
      where.agentId = agentId
    }
    
    if (locationId) {
      where.agentPurchase = {
        locationId: locationId
      }
    }
    
    if (batchId) {
      where.agentPurchase = {
        batchId: batchId
      }
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // Fetch agent sales with pagination
    const [agentSales, total] = await Promise.all([
      prisma.agentSale.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              displayName: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          agentPurchase: {
            select: {
              id: true,
              quantity: true,
              unitCost: true,
              totalCost: true,
              claimedCount: true,
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
                  name: true,
                  notes: true
                }
              }
            }
          },
          voucher: {
            select: {
              id: true,
              voucherNumber: true,
              pin: true,
              status: true,
              retailPrice: true,
              hours: true,
              numberOfUsers: true,
              startDate: true,
              endDate: true,
              expiryDate: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.agentSale.count({ where })
    ])

    return {
      success: true,
      agentSales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching agent sales:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
