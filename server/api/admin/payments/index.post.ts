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

    // Get request body
    const body = await readBody(event)
    const { 
      orderId, 
      provider, 
      status, 
      amount, 
      paynowReference, 
      paynowPollUrl, 
      paynowStatusMsg, 
      providerPayload 
    } = body

    // Validation
    if (!orderId || !provider || !status || !amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID, provider, status, and amount are required'
      })
    }

    if (amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Amount must be greater than 0'
      })
    }

    // Validate order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid order ID'
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

    // Check if payment already exists for this order
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId }
    })

    if (existingPayment) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Payment already exists for this order'
      })
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        orderId,
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
      message: 'Payment created successfully',
      payment
    }
  } catch (error) {
    console.error('Error creating payment:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
