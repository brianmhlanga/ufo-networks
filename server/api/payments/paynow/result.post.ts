import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Paynow configuration
const PAYNOW_INTEGRATION_KEY = 'e101bca8-e35e-4622-8666-09d671f2f117'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate Paynow hash
    const { Paynow } = await import('paynow')
    const paynow = new Paynow('', PAYNOW_INTEGRATION_KEY)
    
    // Extract payment reference from the result
    const paymentReference = body.reference
    const status = body.status
    const amount = body.amount
    const hash = body.hash

    if (!paymentReference) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing payment reference'
      })
    }

    // Find the payment record by payment reference
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        paynowReference: paymentReference
      },
      include: {
        order: {
          include: {
            items: true
          }
        }
      }
    })

    if (!paymentRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment record not found'
      })
    }

    // Update payment record status based on payment result
    if (status === 'Paid' || status === 'Awaiting Delivery') {
      // Payment confirmed - assign vouchers to the order
      await assignVouchersToOrder(paymentRecord.order.id)
      
      // Update payment record status
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'PAID',
          paynowStatusMsg: status
        }
      })

      // Update order status
      await prisma.order.update({
        where: { id: paymentRecord.order.id },
        data: {
          status: 'PAID'
        }
      })

      console.log(`Payment confirmed for order ${paymentRecord.order.id}`)
    } else if (status === 'Cancelled' || status === 'Disputed' || status === 'Failed') {
      // Payment failed - release reserved vouchers
      await releaseReservedVouchers(paymentRecord.order.id)
      
      // Update payment record status
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'FAILED',
          paynowStatusMsg: status
        }
      })

      // Update order status
      await prisma.order.update({
        where: { id: paymentRecord.order.id },
        data: {
          status: 'FAILED'
        }
      })

      console.log(`Payment failed for order ${paymentRecord.order.id}: ${status}`)
    }

    return {
      success: true,
      message: 'Payment result processed successfully'
    }

  } catch (error: any) {
    console.error('Error processing Paynow result:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process payment result'
    })
  }
})

async function assignVouchersToOrder(orderId: string) {
  // Get all reserved vouchers for this order
  const reservedVouchers = await prisma.voucher.findMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED'
    }
  })

  // Assign vouchers to the order (status becomes SOLD)
  await prisma.voucher.updateMany({
    where: {
      id: { in: reservedVouchers.map(v => v.id) }
    },
    data: {
      status: 'SOLD',
      soldAt: new Date()
    }
  })

  console.log(`Assigned ${reservedVouchers.length} vouchers to order ${orderId}`)
}

async function releaseReservedVouchers(orderId: string) {
  // Release reserved vouchers back to AVAILABLE status
  await prisma.voucher.updateMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED'
    },
    data: {
      status: 'AVAILABLE',
      reservedByOrderId: null,
      reservedAt: null
    }
  })

  console.log(`Released reserved vouchers for order ${orderId}`)
}
