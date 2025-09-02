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

    // Check if order has payments
    const paymentCount = await prisma.payment.count({
      where: { orderId }
    })

    if (paymentCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete order. It has ${paymentCount} associated payments.`
      })
    }

    // Check if order has reserved vouchers
    const voucherCount = await prisma.voucher.count({
      where: { reservedByOrderId: orderId }
    })

    if (voucherCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete order. It has ${voucherCount} reserved vouchers.`
      })
    }

    // Delete order with related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete order items first (due to foreign key constraints)
      await tx.orderItem.deleteMany({
        where: { orderId }
      })

      // Delete the order
      await tx.order.delete({
        where: { id: orderId }
      })
    })

    return {
      success: true,
      message: 'Order deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
