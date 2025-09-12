import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Log the webhook data for debugging
    console.log('Paynow webhook received:', body)
    
    // Extract payment details from webhook
    const { 
      paymentReference, 
      status, 
      amount, 
      hash 
    } = body

    if (!paymentReference || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required webhook fields'
      })
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { paynowReference: paymentReference },
      include: { order: true }
    })

    if (!payment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment not found'
      })
    }

    // Verify hash if needed (Paynow security)
    // TODO: Implement hash verification

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: status === 'Paid' || status === 'Awaiting Delivery' ? 'PAID' : 'FAILED',
        paynowStatusMsg: status
      }
    })

    // Update order status
    if (status === 'Paid' || status === 'Awaiting Delivery') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' }
      })

      // Assign vouchers to the order
      await assignVouchersToOrder(payment.orderId)
    } else if (status === 'Cancelled' || status === 'Disputed' || status === 'Failed') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'FAILED' }
      })

      // Release reserved vouchers
      await releaseReservedVouchers(payment.orderId)
    }

    // Return success to Paynow
    return {
      success: true,
      message: 'Webhook processed successfully'
    }

  } catch (error: any) {
    console.error('Error processing Paynow webhook:', error)
    
    // Return error to Paynow (they will retry)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process webhook'
    })
  }
})

async function assignVouchersToOrder(orderId: string) {
  // Find all vouchers reserved for this order
  const reservedVouchers = await prisma.voucher.findMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED'
    }
  })

  // Update vouchers to SOLD status
  await prisma.voucher.updateMany({
    where: {
      id: { in: reservedVouchers.map(v => v.id) }
    },
    data: {
      status: 'SOLD',
      soldAt: new Date()
    }
  })

  // For agent orders, create AgentPurchase record after payment confirmation
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  })

  console.log('Webhook: Order found:', order?.id, 'Agent ID:', order?.agentId)

  if (order && order.agentId) {
    console.log('Webhook: Creating agent purchase for order:', orderId)
    await createAgentPurchaseFromOrder(orderId, order.agentId, order.items)
  } else {
    console.log('Webhook: No agent ID found for order:', orderId)
  }
}

async function releaseReservedVouchers(orderId: string) {
  // Find all vouchers reserved for this order
  const reservedVouchers = await prisma.voucher.findMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED'
    }
  })

  // Update vouchers back to AVAILABLE status
  await prisma.voucher.updateMany({
    where: {
      id: { in: reservedVouchers.map(v => v.id) }
    },
    data: {
      status: 'AVAILABLE',
      reservedByOrderId: null,
      reservedAt: null
    }
  })
}

async function createAgentPurchaseFromOrder(orderId: string, agentId: string, orderItems: any[]) {
  try {
    console.log('createAgentPurchaseFromOrder: Starting for order:', orderId, 'agentId:', agentId)
    
    // Get the agent profile for this user
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: agentId }
    })

    if (!agentProfile) {
      console.error('Agent profile not found for user:', agentId)
      return
    }

    console.log('createAgentPurchaseFromOrder: Agent profile found:', agentProfile.id)

    // Create AgentPurchase records for each item
    for (const item of orderItems) {
      console.log('createAgentPurchaseFromOrder: Creating purchase for item:', item)
      
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
      
      console.log('createAgentPurchaseFromOrder: Created agent purchase:', agentPurchase.id)
    }
    
    console.log('createAgentPurchaseFromOrder: Completed successfully')
  } catch (error) {
    console.error('Error creating agent purchase from order:', error)
    // Don't throw error here as the order was already created successfully
  }
}
