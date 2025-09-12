import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('create-purchase-from-order API called')
    const body = await readBody(event)
    console.log('Request body:', body)
    
    const { orderId, agentId } = body

    if (!orderId || !agentId) {
      console.log('Missing required fields:', { orderId, agentId })
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: orderId, agentId'
      })
    }

    // Get the order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Verify the order belongs to this agent
    if (order.agentId !== agentId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Order does not belong to this agent'
      })
    }

    // Get the agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: agentId }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent profile not found'
      })
    }

    // Check if agent purchase already exists for this order
    const existingPurchase = await prisma.agentPurchase.findFirst({
      where: {
        notes: {
          contains: orderId
        }
      }
    })

    if (existingPurchase) {
      return {
        success: true,
        message: 'Agent purchase already exists for this order',
        data: existingPurchase
      }
    }

    // Create AgentPurchase records for each item
    const agentPurchases = []
    for (const item of order.items) {
      const agentPurchase = await prisma.agentPurchase.create({
        data: {
          agentId: agentProfile.id,
          locationId: item.locationId || null,
          hours: item.hours,
          numberOfUsers: item.numberOfUsers,
          quantity: item.quantity,
          unitCost: item.unitPrice,
          totalCost: item.lineTotal,
          claimedCount: 0,
          notes: `Purchase of ${item.quantity} ${item.hours}H ${item.numberOfUsers}U vouchers via order ${orderId}`
        }
      })
      agentPurchases.push(agentPurchase)
    }

    return {
      success: true,
      message: 'Agent purchase created successfully',
      data: agentPurchases
    }

  } catch (error: any) {
    console.error('Error creating agent purchase from order:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
