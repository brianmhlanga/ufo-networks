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

    // Get payment ID from route params
    const paymentId = getRouterParam(event, 'id')

    if (!paymentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Payment ID is required'
      })
    }

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId }
    })

    if (!existingPayment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment not found'
      })
    }

    // Check if payment is in a final state (PAID, FAILED, CANCELLED, REFUNDED)
    const finalStatuses = ['PAID', 'FAILED', 'CANCELLED', 'REFUNDED']
    if (finalStatuses.includes(existingPayment.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete payment with status: ${existingPayment.status}. Only pending and authorized payments can be deleted.`
      })
    }

    // Delete payment
    await prisma.payment.delete({
      where: { id: paymentId }
    })

    return {
      success: true,
      message: 'Payment deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting payment:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
