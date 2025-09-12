import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const orderId = getRouterParam(event, 'id')
    
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required'
      })
    }

    // Find vouchers assigned to this order (including already redeemed ones)
    const vouchers = await prisma.voucher.findMany({
      where: {
        reservedByOrderId: orderId,
        status: {
          in: ['RESERVED', 'SOLD', 'REDEEMED']
        }
      },
      select: {
        id: true,
        voucherNumber: true,
        pin: true,
        hours: true,
        numberOfUsers: true,
        retailPrice: true,
        startDate: true,
        endDate: true,
        expiryDate: true,
        status: true,
        redeemedAt: true,
        location: {
          select: {
            id: true,
            name: true,
            code: true,
            town: true,
            province: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Automatically mark non-redeemed vouchers as REDEEMED when they are accessed
    if (vouchers.length > 0) {
      const nonRedeemedVouchers = vouchers.filter(v => v.status !== 'REDEEMED')
      
      if (nonRedeemedVouchers.length > 0) {
        const voucherIds = nonRedeemedVouchers.map(v => v.id)
        
        await prisma.voucher.updateMany({
          where: {
            id: { in: voucherIds }
          },
          data: {
            status: 'REDEEMED',
            redeemedAt: new Date()
          }
        })

        // Update the vouchers array to reflect the new status
        vouchers.forEach(voucher => {
          if (voucher.status !== 'REDEEMED') {
            voucher.status = 'REDEEMED'
            voucher.redeemedAt = new Date()
          }
        })
      }
    }

    return {
      success: true,
      vouchers
    }

  } catch (error: any) {
    console.error('Error fetching vouchers for order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch vouchers'
    })
  }
})
