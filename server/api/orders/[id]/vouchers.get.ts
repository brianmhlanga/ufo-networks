import { PrismaClient } from '@prisma/client'
import { ensureVouchersForPaidOrder } from '~/server/utils/paymentFulfilment'

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

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Never hand out PINs for an order that has not been paid for. The order id is the only
    // thing guarding this endpoint, so without this check anyone holding (or guessing) an id
    // could read the PINs of a pending order — and the redemption below would burn them.
    if (order.status !== 'PAID') {
      return {
        success: true,
        paid: false,
        status: order.status,
        vouchers: []
      }
    }

    // Recover a paid order that ended up with no vouchers linked (its reservation was released by
    // the old status-flapping bug). Idempotent — a no-op once the order is whole.
    await ensureVouchersForPaidOrder(prisma, orderId)

    const vouchers = await prisma.voucher.findMany({
      where: {
        reservedByOrderId: orderId,
        status: {
          in: ['SOLD', 'REDEEMED']
        }
      },
      select: {
        id: true,
        voucherNumber: true,
        pin: true,
        hours: true,
        numberOfUsers: true,
        dataLimitGb: true,
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
            province: true,
            wifiPassword: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Viewing the PINs counts as redemption — this is the only redemption signal the app has,
    // since the WiFi controller is external. Gated on a PAID order by the check above.
    const nonRedeemed = vouchers.filter(v => v.status !== 'REDEEMED')

    if (nonRedeemed.length > 0) {
      const redeemedAt = new Date()

      await prisma.voucher.updateMany({
        where: { id: { in: nonRedeemed.map(v => v.id) } },
        data: {
          status: 'REDEEMED',
          redeemedAt
        }
      })

      nonRedeemed.forEach(voucher => {
        voucher.status = 'REDEEMED'
        voucher.redeemedAt = redeemedAt
      })
    }

    return {
      success: true,
      paid: true,
      status: order.status,
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
