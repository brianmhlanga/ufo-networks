import { PrismaClient } from '@prisma/client'
import { getAuditActor, serializeForAudit, writeAuditLog } from '~/server/utils/auditLog'
import { getPaynowAuthEmail, getSiteUrl, requirePaynowCredentials } from '~/server/utils/paynow'
import { normalizeZimbabwePhone } from '~/utils/phone'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Order creation: Request body:', body)
    
    const { 
      locationId, 
      customerEmail, 
      customerPhone, 
      items, 
      paymentMethod, 
      mobilePhone, 
      mobileProvider,
      isAgentOrder,
      agentId
    } = body
    
    console.log('Order creation: Extracted values:', {
      isAgentOrder,
      agentId,
      customerEmail,
      paymentMethod
    })

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

    if (isAgentOrder) {
      const session = await getUserSession(event)
      if (!session?.user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'You must be logged in to place an agent order'
        })
      }
      const user = session.user as { id: string; role?: string }
      if (user.role !== 'AGENT') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Only agents can place agent orders'
        })
      }
      resolvedAgentId = user.id

      // An agent buys stock for their own location only. Take it from their profile — never from
      // the request body, which the agent controls.
      const agentProfile = await prisma.agentProfile.findUnique({
        where: { userId: user.id },
        select: { locationId: true }
      })

      if (!agentProfile?.locationId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No location assigned to your agent account. Contact an administrator.'
        })
      }

      agentLocationId = agentProfile.locationId
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

      const lineTotal = Number(item.unitPrice) * Number(item.quantity)
      subtotal += lineTotal
      totalItems += Number(item.quantity)

      // Add voucher IDs to reserve
      vouchersToReserve.push(...availableVouchers.map(v => v.id))

      orderItems.push({
        locationId: itemLocationId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
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

    console.log('Order creation: Final orderData:', orderData)
    
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
    
    console.log('Order creation: Created order:', order)
    
    // Verify the order was created with agentId
    if (isAgentOrder) {
      const verifyOrder = await prisma.order.findUnique({
        where: { id: order.id },
        select: { id: true, agentId: true, buyerEmail: true }
      })
      console.log('Order creation: Verification query result:', verifyOrder)
    }

    // Initialize Paynow payment
    const { Paynow } = await import('paynow')
    const { integrationId, integrationKey } = requirePaynowCredentials()
    const paynow = new Paynow(integrationId, integrationKey)

    // Set URLs. These must be the public site origin, never the request Host header
    // (the reverse proxy rewrites it to 127.0.0.1:3000).
    const baseUrl = getSiteUrl(event)
    paynow.resultUrl = `${baseUrl}/api/payments/paynow/webhook`
    
    console.log('Order creation: Setting webhook URL to:', paynow.resultUrl)
    
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

    let response
    if (paymentMethod === 'mobile') {
      // Mobile payment (Ecocash/OneMoney)
      response = await paynow.sendMobile(payment, normalizedMobilePhone!, mobileProvider)
    } else {
      // Web payment
      response = await paynow.send(payment)
    }

    if (response.success) {
      // Create payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'PAYNOW',
          status: 'PENDING',
          amount: total,
          paynowReference: paymentReference,
          paynowPollUrl: response.pollUrl || '',
          providerPayload: response
        }
      })

             // Only reserve vouchers for regular orders, not agent orders
       if (!isAgentOrder) {
         await reserveVouchersForOrder(order.id, vouchersToReserve)
       }

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

async function reserveVouchersForOrder(orderId: string, voucherIds: string[]) {
  // Reserve vouchers
  await prisma.voucher.updateMany({
    where: {
      id: { in: voucherIds }
    },
    data: {
      status: 'RESERVED',
      reservedByOrderId: orderId,
      reservedAt: new Date()
    }
  })
}
