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

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { 
      userId, 
      buyerEmail, 
      buyerPhone, 
      buyerName, 
      currency, 
      subtotal, 
      discountTotal, 
      total, 
      status, 
      items 
    } = body

    // Validation
    if (!buyerEmail && !buyerPhone && !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either buyer contact info or user ID is required'
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order items are required'
      })
    }

    if (!subtotal || !total || subtotal <= 0 || total <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid subtotal and total are required'
      })
    }

    // Validate user exists if provided
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!userExists) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid user ID'
        })
      }
    }

    // Validate items
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Valid quantity is required for all items'
        })
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Valid unit price is required for all items'
        })
      }
      if (!item.lineTotal || item.lineTotal <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Valid line total is required for all items'
        })
      }
    }

    // Update order with items in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update the order
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          userId: userId || null,
          buyerEmail: buyerEmail || null,
          buyerPhone: buyerPhone || null,
          buyerName: buyerName || null,
          currency: currency || 'USD',
          subtotal: parseFloat(subtotal),
          discountTotal: parseFloat(discountTotal || 0),
          total: parseFloat(total),
          status: status || 'PENDING'
        }
      })

      // Delete existing items
      await tx.orderItem.deleteMany({
        where: { orderId }
      })

      // Create new order items
      const orderItems = await Promise.all(
        items.map(item =>
          tx.orderItem.create({
            data: {
              orderId: orderId,
              locationId: item.locationId || null,
              batchId: item.batchId || null,
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              lineTotal: parseFloat(item.lineTotal)
            }
          })
        )
      )

      return {
        ...order,
        items: orderItems
      }
    })

    return {
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    }
  } catch (error) {
    console.error('Error updating order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
