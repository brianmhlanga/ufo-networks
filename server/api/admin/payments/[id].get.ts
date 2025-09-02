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

    // Fetch payment with all related data
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          select: {
            id: true,
            buyerName: true,
            buyerEmail: true,
            buyerPhone: true,
            total: true,
            status: true,
            currency: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
              }
            },
            items: {
              select: {
                id: true,
                quantity: true,
                unitPrice: true,
                lineTotal: true,
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
                }
              }
            }
          }
        }
      }
    })

    if (!payment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment not found'
      })
    }

    return {
      success: true,
      payment
    }
  } catch (error) {
    console.error('Error fetching payment:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
