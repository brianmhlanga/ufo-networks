import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { pollUrl, paymentReference } = body

    if (!pollUrl || !paymentReference) {
      throw createError({
        statusCode: 400,
        statusMessage: 'pollUrl and paymentReference are required'
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

    // Check payment status using Paynow's poll URL
    try {
      const response = await $fetch(pollUrl)
      
      // Debug: Log the response
      console.log('Paynow poll response:', response)
      console.log('Response type:', typeof response)
      
      // Parse the response to get the status
      // Paynow returns URL-encoded query string format
      let status = 'Pending'
      
      if (typeof response === 'string') {
        // Parse URL-encoded response
        const params = new URLSearchParams(response)
        status = params.get('status') || 'Pending'
        
        console.log('Parsed status from URL params:', status)
        
        // Also check for other status variations
        if (response.includes('status=Paid')) {
          status = 'Paid'
        } else if (response.includes('status=Awaiting Delivery')) {
          status = 'Awaiting Delivery'
        } else if (response.includes('status=Cancelled')) {
          status = 'Cancelled'
        } else if (response.includes('status=Disputed')) {
          status = 'Disputed'
        } else if (response.includes('status=Failed')) {
          status = 'Failed'
        }
        
        console.log('Final parsed status:', status)
      } else if (typeof response === 'object') {
        // JSON response (fallback)
        status = response.status || response.Status || 'Pending'
        console.log('Status from JSON response:', status)
      }

      // Update payment status in database
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: status === 'Paid' || status === 'Awaiting Delivery' ? 'PAID' : 'FAILED',
          paynowStatusMsg: status
        }
      })

      // If payment is successful, update order status and assign vouchers
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

      return {
        success: true,
        status,
        paymentId: payment.id,
        orderId: payment.orderId
      }

    } catch (pollError) {
      console.error('Error polling Paynow:', pollError)
      
      // Return current status from database if polling fails
      return {
        success: true,
        status: payment.paynowStatusMsg || 'Pending',
        paymentId: payment.id,
        orderId: payment.orderId
      }
    }

  } catch (error: any) {
    console.error('Error checking payment status:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check payment status'
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
