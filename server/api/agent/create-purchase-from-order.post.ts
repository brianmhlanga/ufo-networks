import { PrismaClient } from '@prisma/client'
import { createAgentPurchaseFromOrder } from '~/server/utils/paymentFulfilment'
import { requireActiveUser } from '~/server/utils/requireRole'

const prisma = new PrismaClient()

/**
 * Record the stock from the signed-in agent's own paid order. The webhook and status poll already
 * do this on payment; this route lets the buy page confirm it. It is idempotent, and it only
 * credits an order that belongs to the caller and has been paid.
 */
export default defineEventHandler(async (event) => {
  try {
    const user = await requireActiveUser(event, prisma, ['AGENT'])

    const { orderId } = await readBody(event)
    if (!orderId) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required field: orderId' })
    }

    const order = await prisma.order.findUnique({
      where: { id: String(orderId) },
      include: { items: true },
    })

    if (!order || order.agentId !== user.id) {
      throw createError({ statusCode: 404, statusMessage: 'Order not found' })
    }

    if (order.status !== 'PAID') {
      throw createError({ statusCode: 400, statusMessage: 'Order has not been paid' })
    }

    const credited = await createAgentPurchaseFromOrder(prisma, order.id, user.id, order.items)
    if (!credited) {
      throw createError({ statusCode: 500, statusMessage: 'Could not record agent purchase' })
    }

    return { success: true, message: 'Agent purchase recorded' }
  } catch (error: any) {
    console.error('Error creating agent purchase from order:', error?.statusMessage || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
    })
  }
})
