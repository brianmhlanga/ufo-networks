import { PrismaClient } from '@prisma/client'
import { getAuditActor, serializeForAudit, writeAuditLog } from '~/server/utils/auditLog'
import { getPaynowAuthEmail, getSiteUrl, requirePaynowCredentials } from '~/server/utils/paynow'
import { releaseReservedVouchers } from '~/server/utils/paymentFulfilment'
import { normalizeZimbabwePhone } from '~/utils/phone'
import { requireActiveUser } from '~/server/utils/requireRole'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { 
      locationId, 
      customerEmail, 
      customerPhone, 
      items, 
      paymentMethod, 
      mobilePhone, 
      mobileProvider,
      isAgentOrder
    } = body

    // Validate required fields
    if (!items || !paymentMethod) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: items, paymentMethod'
      })
    }

    // For agent orders, we don't need locationId as it's per item
    if (!isAgentOrder && !locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required field: locationId'
      })
    }

    // Public orders: the phone number is mandatory (it is the delivery channel for the voucher
    // code) and must be Zimbabwean. Email is optional. Agent orders collect neither.
    let normalizedCustomerPhone: string | null = null

    if (!isAgentOrder) {
      normalizedCustomerPhone = normalizeZimbabwePhone(customerPhone)

      if (!normalizedCustomerPhone) {
        throw createError({
          statusCode: 400,
          statusMessage: 'A valid Zimbabwean mobile number is required, e.g. 077 123 4567'
        })
      }

      if (customerEmail && !String(customerEmail).includes('@')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid email address'
        })
      }
    }

    // For agent orders: resolve agent from session so agentId always references a valid User (avoids FK violation after reseed/stale client id)
    let resolvedAgentId: string | null = null
    let agentLocationId: string | null = null
    let agentDiscountPct = 0

    if (isAgentOrder) {
      const user = await requireActiveUser(event, prisma, ['AGENT'])
      resolvedAgentId = user.id

      // An agent buys stock for their own location only. Take it from their profile — never from
      // the request body, which the agent controls.
      const agentProfile = await prisma.agentProfile.findUnique({
        where: { userId: user.id },
        select: { locationId: true, defaultDiscountPct: true }
      })

      if (!agentProfile?.locationId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No location assigned to your agent account. Contact an administrator.'
        })
      }

      agentLocationId = agentProfile.locationId
      agentDiscountPct = Number(agentProfile.defaultDiscountPct) || 0
    }

    let normalizedMobilePhone: string | null = null

    if (paymentMethod === 'mobile') {
      normalizedMobilePhone = normalizeZimbabwePhone(mobilePhone)

      if (!normalizedMobilePhone || !mobileProvider) {
        throw createError({
          statusCode: 400,
          statusMessage: 'A valid Zimbabwean mobile money number and provider are required'
        })
      }
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one item is required'
      })
    }

    // Check voucher availability and calculate totals
    let subtotal = 0
    let totalItems = 0
    const orderItems = []
    const vouchersToReserve: string[] = []

    for (const item of items) {
      if (item.quantity <= 0) continue

      // Agent orders draw from the agent's own location (resolved from their profile above);
      // public orders draw from the location the buyer chose. Either way an order item is always
      // tied to one location — it must never fall back to "any location".
      const itemLocationId = isAgentOrder ? agentLocationId! : locationId

      const voucherWhere: any = {
        status: 'AVAILABLE',
        locationId: itemLocationId,
        hours: Number(item.hours),
        numberOfUsers: Number(item.numberOfUsers),
        endDate: { gte: new Date() }
      }

      // Agents pay a discounted price, so their unit price will not match the voucher's retail
      // price. Only public orders can match on it.
      if (!isAgentOrder) {
        voucherWhere.retailPrice = Number(item.unitPrice)
      }

      const availableVouchers = await prisma.voucher.findMany({
        where: voucherWhere,
        take: Number(item.quantity),
        select: {
          id: true,
          hours: true,
          numberOfUsers: true,
          retailPrice: true
        }
      })

      if (availableVouchers.length < Number(item.quantity)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Only ${availableVouchers.length} vouchers available for the ${item.hours} hour package at this location`
        })
      }

      // The price is always decided here, never by the client. Public buyers pay the retail price
      // they matched on above. Agents pay retail less their own discount, using the same formula
      // as /api/agent/available-vouchers; if the matched vouchers carry different retail prices,
      // the highest one is used so an agent can never pay less than intended.
      let unitPrice = Number(item.unitPrice)
      if (isAgentOrder) {
        const retail = Math.max(...availableVouchers.map(v => Number(v.retailPrice)))
        unitPrice = Number((retail * (1 - agentDiscountPct / 100)).toFixed(2))
      }

      const lineTotal = Number((unitPrice * Number(item.quantity)).toFixed(2))
      subtotal += lineTotal
      totalItems += Number(item.quantity)

      // Add voucher IDs to reserve
      vouchersToReserve.push(...availableVouchers.map(v => v.id))

      orderItems.push({
        locationId: itemLocationId,
        quantity: Number(item.quantity),
        unitPrice,
        lineTotal,
        hours: Number(item.hours),
        numberOfUsers: Number(item.numberOfUsers)
      })
    }

    if (totalItems === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid items in order'
      })
    }

    const total = subtotal
    const paymentReference = `UFO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order in database
    const orderData: any = {
      buyerEmail: customerEmail?.trim() || null,
      buyerPhone: normalizedCustomerPhone,
      subtotal,
      total,
      status: 'PENDING',
      items: {
        create: orderItems
      }
    }

    // Add agent information if it's an agent order (use session-resolved id so FK is valid)
    if (isAgentOrder && resolvedAgentId) {
      orderData.agentId = resolvedAgentId
    }

    // Create the order
    const order = await prisma.order.create({
      data: orderData
    })

    const audit = await getAuditActor(event)
    const orderSnapshot = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true, payments: true },
    })
    await writeAuditLog(prisma, {
      ...audit,
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: order.id,
      details: {
        snapshot: serializeForAudit(orderSnapshot),
        paymentMethod,
        isAgentOrder: Boolean(isAgentOrder),
      },
    })
    
    // Initialize Paynow payment
    const { Paynow } = await import('paynow')
    const { integrationId, integrationKey } = requirePaynowCredentials()
    const paynow = new Paynow(integrationId, integrationKey)

    // Set URLs. These must be the public site origin, never the request Host header
    // (the reverse proxy rewrites it to 127.0.0.1:3000).
    const baseUrl = getSiteUrl(event)
    paynow.resultUrl = `${baseUrl}/api/payments/paynow/webhook`

    // Set return URL based on order type
    if (isAgentOrder) {
      paynow.returnUrl = `${baseUrl}/agent/purchase-success?orderId=${order.id}&total=${total}`
    } else {
      paynow.returnUrl = `${baseUrl}/vouchers-${order.id}`
    }

    // Create payment
    const payment = paynow.createPayment(paymentReference, getPaynowAuthEmail(customerEmail))

         // Add items to payment
     for (const item of orderItems) {
       // Since we don't store voucherType, we'll use a generic description
       payment.add(`WiFi Voucher × ${item.quantity}`, Number(item.lineTotal))
     }

    // Persist the payment record and reserve the vouchers BEFORE handing the transaction to
    // Paynow. Paynow can POST its IPN while sendMobile()/send() is still in flight — a buyer who
    // cancels on their phone triggers it within a second — and if the row does not exist yet the
    // callback 404s and the payment outcome is lost.
    const paymentRecord = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'PAYNOW',
        status: 'PENDING',
        amount: total,
        paynowReference: paymentReference,
        paynowPollUrl: ''
      }
    })

    if (!isAgentOrder) {
      const reserved = await reserveVouchersForOrder(order.id, vouchersToReserve)

      // Another buyer took some of these vouchers between our availability check and the
      // reservation. Give back what we did get and stop before charging anyone.
      if (reserved < vouchersToReserve.length) {
        await releaseReservedVouchers(prisma, order.id)
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: { status: 'FAILED', paynowStatusMsg: 'Vouchers no longer available' }
        })
        await prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED' } })

        throw createError({
          statusCode: 409,
          statusMessage: 'Some of these vouchers were just sold. Please try again.'
        })
      }
    }

    let response
    if (paymentMethod === 'mobile') {
      // Mobile payment (Ecocash/OneMoney)
      response = await paynow.sendMobile(payment, normalizedMobilePhone!, mobileProvider)
    } else {
      // Web payment
      response = await paynow.send(payment)
    }

    if (response.success) {
      // Record the poll URL now that Paynow has issued one. An early IPN may already have
      // settled this payment, so never downgrade a decided status back to PENDING here.
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          paynowPollUrl: response.pollUrl || '',
          providerPayload: response
        }
      })

      // For web payments, we still need to redirect, but also provide pollUrl for status checking
      if (paymentMethod === 'web') {
        return {
          success: true,
          orderId: order.id,
          paymentReference,
          paymentRecordId: paymentRecord.id,
          redirectUrl: response.redirectUrl,
          pollUrl: response.pollUrl,
          instructions: 'Please complete payment on the Paynow website',
          paymentMethod,
          total: Number(total),
          shouldRedirect: true
        }
      } else {
        // For mobile payments, show polling
        return {
          success: true,
          orderId: order.id,
          paymentReference,
          paymentRecordId: paymentRecord.id,
          redirectUrl: response.redirectUrl,
          pollUrl: response.pollUrl,
          instructions: response.instructions,
          paymentMethod,
          total: Number(total),
          shouldRedirect: false
        }
      }
    } else {
      // Paynow refused the transaction. Release the stock we were holding so it does not sit
      // RESERVED against an order that can never be paid.
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: 'FAILED', paynowStatusMsg: response.error || 'Payment initiation failed' }
      })
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      })
      await releaseReservedVouchers(prisma, order.id)

      throw createError({
        statusCode: 400,
        statusMessage: response.error || 'Payment initiation failed'
      })
    }

  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create order'
    })
  }
})

/**
 * Reserve vouchers for an order. The status:'AVAILABLE' guard makes this atomic per voucher, so
 * two buyers racing for the same voucher cannot both reserve it. Returns how many were reserved.
 */
async function reserveVouchersForOrder(orderId: string, voucherIds: string[]) {
  const result = await prisma.voucher.updateMany({
    where: {
      id: { in: voucherIds },
      status: 'AVAILABLE'
    },
    data: {
      status: 'RESERVED',
      reservedByOrderId: orderId,
      reservedAt: new Date()
    }
  })

  return result.count
}
