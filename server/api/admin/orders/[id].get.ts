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

    // Get order ID from route params
    const orderId = getRouterParam(event, 'id')

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required'
      })
    }

    // Fetch order with all related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true
          }
        },
        items: {
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
            },
            batch: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        payments: {
          select: {
            id: true,
            provider: true,
            status: true,
            amount: true,
            paynowReference: true,
            paynowStatusMsg: true,
            createdAt: true,
            updatedAt: true
          }
        },
        reservedVouchers: {
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
            expiryDate: true,
            createdAt: true
          }
        }
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    return {
      success: true,
      order
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
