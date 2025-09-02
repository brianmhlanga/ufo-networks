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

    // Get request body
    const body = await readBody(event)
    const { 
      provider, 
      status, 
      amount, 
      paynowReference, 
      paynowPollUrl, 
 paynowStatusMsg, 
      providerPayload 
    } = body

    // Validation
    if (!provider || !status || !amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provider, status, and amount are required'
      })
    }

    if (amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Amount must be greater than 0'
      })
    }

    // Validate provider enum
    const validProviders = ['PAYNOW']
    if (!validProviders.includes(provider)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payment provider'
      })
    }

    // Validate status enum
    const validStatuses = ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payment status'
      })
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        provider,
        status,
        amount: parseFloat(amount),
        paynowReference: paynowReference || null,
        paynowPollUrl: paynowPollUrl || null,
        paynowStatusMsg: paynowStatusMsg || null,
        providerPayload: providerPayload || null
      },
      include: {
        order: {
          select: {
            id: true,
            buyerName: true,
            buyerEmail: true,
            buyerPhone: true,
            total: true,
            status: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Payment updated successfully',
      payment: updatedPayment
    }
  } catch (error) {
    console.error('Error updating payment:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
