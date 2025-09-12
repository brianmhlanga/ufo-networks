import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const orderId = getRouterParam(event, 'id')

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required'
      })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            location: true
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

    // Include voucher specifications for matching
    const itemsWithDetails = order.items.map(item => ({
      id: item.id,
      locationId: item.locationId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      hours: item.hours,
      numberOfUsers: item.numberOfUsers,
      location: item.location
    }))

    return {
      success: true,
      order: {
        id: order.id,
        buyerEmail: order.buyerEmail,
        buyerPhone: order.buyerPhone,
        buyerName: order.buyerName,
        subtotal: order.subtotal,
        discountTotal: order.discountTotal,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: itemsWithDetails,
        payments: order.payments
      }
    }

  } catch (error: any) {
    console.error('Error fetching order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch order'
    })
  }
})
