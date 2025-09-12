import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { orderId } = body

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required field: orderId'
      })
    }

    console.log('Fixing existing agent order:', orderId)

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

    console.log('Order found:', order)

    if (!order.agentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order is not an agent order'
      })
    }

    // Get the agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: order.agentId }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent profile not found'
      })
    }

    console.log('Agent profile found:', agentProfile)

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
      console.log('Creating agent purchase for item:', item)
      
      const agentPurchase = await prisma.agentPurchase.create({
        data: {
          agentId: agentProfile.id,
          locationId: item.locationId || null,
          quantity: item.quantity,
          unitCost: item.unitPrice,
          totalCost: item.lineTotal,
          claimedCount: 0,
          notes: `Purchase of ${item.quantity} ${item.hours}H ${item.numberOfUsers}U vouchers via order ${orderId}`
        }
      })
      
      console.log('Created agent purchase:', agentPurchase)
      agentPurchases.push(agentPurchase)
    }

    return {
      success: true,
      message: 'Agent purchase created successfully for existing order',
      data: agentPurchases
    }

  } catch (error: any) {
    console.error('Error fixing existing agent order:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
