import type { PrismaClient } from '@prisma/client'
import { sendVoucherEmail } from '~/server/email/emailService'

/**
 * Shared Paynow fulfilment. Both the IPN webhook and the client-side status poll converge here,
 * so a paid order is fulfilled exactly once regardless of which one confirms it first.
 */

export type PaynowStatus = 'PAID' | 'FAILED' | 'PENDING'

const PAID_STATUSES = ['paid', 'awaiting delivery']
const FAILED_STATUSES = ['cancelled', 'disputed', 'failed', 'refunded']

/**
 * Map a raw Paynow status string onto our own tri-state.
 *
 * Anything we do not recognise is PENDING, not FAILED: Paynow legitimately reports
 * `Created`/`Sent`/`Pending` while the buyer is still on the payment page, and treating those
 * as failures would release the buyer's reserved vouchers out from under them.
 */
export function mapPaynowStatus(status: string | undefined | null): PaynowStatus {
  const normalized = String(status || '').trim().toLowerCase()

  if (PAID_STATUSES.includes(normalized)) return 'PAID'
  if (FAILED_STATUSES.includes(normalized)) return 'FAILED'
  return 'PENDING'
}

/**
 * Apply a Paynow status to a payment and its order, fulfilling or releasing as needed.
 * Safe to call repeatedly with the same status.
 */
export async function applyPaynowStatus(
  prisma: PrismaClient,
  paymentId: string,
  orderId: string,
  rawStatus: string,
) {
  const outcome = mapPaynowStatus(rawStatus)

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: outcome,
      paynowStatusMsg: rawStatus,
    },
  })

  if (outcome === 'PAID') {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    })
    await assignVouchersToOrder(prisma, orderId)
  } else if (outcome === 'FAILED') {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED' },
    })
    await releaseReservedVouchers(prisma, orderId)
  }

  return outcome
}

/**
 * Move an order's reserved vouchers to SOLD, create the agent entitlement if it is an agent
 * order, and email the PINs to the buyer.
 */
export async function assignVouchersToOrder(prisma: PrismaClient, orderId: string) {
  // Reserved → SOLD for anything still held for this order.
  const reservedVouchers = await prisma.voucher.findMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED',
    },
    select: { id: true },
  })

  if (reservedVouchers.length) {
    await prisma.voucher.updateMany({
      where: { id: { in: reservedVouchers.map((v) => v.id) } },
      data: {
        status: 'SOLD',
        soldAt: new Date(),
      },
    })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (!order) return

  if (order.agentId) {
    await createAgentPurchaseFromOrder(prisma, orderId, order.agentId, order.items)
    // Agents collect stock in bulk and print for their walk-in customers; no buyer email.
    return
  }

  // Self-heal a paid public order whose reservation was lost. This happens to orders created
  // before the status-flapping fix: an early "Pending" poll released the held vouchers, so when
  // "Paid" landed there was nothing to mark SOLD and the buyer saw zero vouchers. Claim fresh
  // AVAILABLE vouchers matching each item so simply reloading the confirmation page recovers it.
  await ensureVouchersForPaidOrder(prisma, orderId)

  await deliverVoucherEmail(prisma, orderId)
}

/**
 * Guarantee a paid public order has as many vouchers tied to it as it paid for. Idempotent:
 * counts what is already linked and only claims the shortfall.
 */
export async function ensureVouchersForPaidOrder(prisma: PrismaClient, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (!order || order.status !== 'PAID' || order.agentId) return

  for (const item of order.items) {
    const linked = await prisma.voucher.count({
      where: {
        reservedByOrderId: orderId,
        hours: item.hours,
        numberOfUsers: item.numberOfUsers,
        retailPrice: Number(item.unitPrice),
      },
    })

    const missing = item.quantity - linked
    if (missing <= 0) continue

    const fresh = await prisma.voucher.findMany({
      where: {
        status: 'AVAILABLE',
        ...(item.locationId ? { locationId: item.locationId } : {}),
        hours: item.hours,
        numberOfUsers: item.numberOfUsers,
        retailPrice: Number(item.unitPrice),
      },
      take: missing,
      select: { id: true },
    })

    if (fresh.length) {
      await prisma.voucher.updateMany({
        where: { id: { in: fresh.map((v) => v.id) } },
        data: {
          status: 'SOLD',
          soldAt: new Date(),
          reservedByOrderId: orderId,
          reservedAt: new Date(),
        },
      })
    }

    if (fresh.length < missing) {
      console.error(
        `Order ${orderId}: paid for ${item.quantity} of ${item.hours}h/${item.numberOfUsers}u but only ${linked + fresh.length} available — ${missing - fresh.length} short`,
      )
    }
  }
}

/**
 * Email the buyer their voucher PINs. Idempotent: `Order.voucherEmailSentAt` is claimed with a
 * conditional update before we send, so the webhook and the status poll racing each other cannot
 * both send.
 *
 * A delivery failure must never fail the payment — the vouchers are already SOLD and the buyer can
 * still read the PINs off the confirmation page.
 */
export async function deliverVoucherEmail(prisma: PrismaClient, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, buyerEmail: true, buyerName: true, total: true, voucherEmailSentAt: true },
  })

  if (!order?.buyerEmail || order.voucherEmailSentAt) return

  // Claim the send. updateMany with the null guard is atomic, so a concurrent caller sees count 0.
  const claim = await prisma.order.updateMany({
    where: { id: orderId, voucherEmailSentAt: null },
    data: { voucherEmailSentAt: new Date() },
  })

  if (claim.count === 0) return

  try {
    const vouchers = await prisma.voucher.findMany({
      where: { reservedByOrderId: orderId },
      select: {
        voucherNumber: true,
        pin: true,
        hours: true,
        numberOfUsers: true,
        dataLimitGb: true,
        location: { select: { name: true, wifiPassword: true } },
      },
    })

    if (!vouchers.length) {
      await prisma.order.update({ where: { id: orderId }, data: { voucherEmailSentAt: null } })
      return
    }

    await sendVoucherEmail({
      to: order.buyerEmail,
      orderId: order.id,
      total: Number(order.total),
      vouchers: vouchers.map((v) => ({
        voucherNumber: v.voucherNumber,
        pin: v.pin,
        hours: v.hours,
        numberOfUsers: v.numberOfUsers,
        dataLimitGb: v.dataLimitGb,
        locationName: v.location?.name || '',
        wifiPassword: v.location?.wifiPassword || null,
      })),
    })
  } catch (error) {
    // Release the claim so a later poll/webhook can retry the send.
    await prisma.order.update({ where: { id: orderId }, data: { voucherEmailSentAt: null } })
    console.error(`[Voucher Email] Failed to send for order ${orderId}:`, error)
  }
}

export async function releaseReservedVouchers(prisma: PrismaClient, orderId: string) {
  await prisma.voucher.updateMany({
    where: {
      reservedByOrderId: orderId,
      status: 'RESERVED',
    },
    data: {
      status: 'AVAILABLE',
      reservedByOrderId: null,
      reservedAt: null,
    },
  })
}

async function createAgentPurchaseFromOrder(
  prisma: PrismaClient,
  orderId: string,
  agentUserId: string,
  orderItems: any[],
) {
  try {
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: agentUserId },
    })

    if (!agentProfile) {
      console.error('Agent profile not found for user:', agentUserId)
      return
    }

    // An order is only fulfilled once, but a retried IPN could land here twice.
    const existing = await prisma.agentPurchase.findFirst({
      where: { notes: { contains: `via order ${orderId}` } },
      select: { id: true },
    })

    if (existing) return

    for (const item of orderItems) {
      await prisma.agentPurchase.create({
        data: {
          agentId: agentProfile.id,
          locationId: item.locationId || agentProfile.locationId || null,
          hours: item.hours,
          numberOfUsers: item.numberOfUsers,
          quantity: item.quantity,
          unitCost: item.unitPrice,
          totalCost: item.lineTotal,
          claimedCount: 0,
          notes: `Purchase of ${item.quantity} ${item.hours}H ${item.numberOfUsers}U vouchers via order ${orderId}`,
        },
      })
    }
  } catch (error) {
    // The payment has already succeeded; never surface this as a payment failure.
    console.error('Error creating agent purchase from order:', error)
  }
}
