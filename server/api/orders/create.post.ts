import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Paynow configuration
const PAYNOW_INTEGRATION_ID = '21547'
const PAYNOW_INTEGRATION_KEY = 'e101bca8-e35e-4622-8666-09d671f2f117'

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

    if (!customerEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required field: customerEmail'
      })
    }

    // For agent orders: resolve agent from session so agentId always references a valid User (avoids FK violation after reseed/stale client id)
    let resolvedAgentId: string | null = null
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
    }

    if (paymentMethod === 'mobile' && (!mobilePhone || !mobileProvider)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mobile phone and provider required for mobile payments'
      })
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

      // For agent orders, locationId is per item
      const itemLocationId = isAgentOrder ? item.locationId : locationId

             // Get available vouchers for this type (hours, users, price)
       const voucherWhere: any = {
         status: 'AVAILABLE',
         hours: Number(item.hours),
         numberOfUsers: Number(item.numberOfUsers),
         endDate: { gte: new Date() }
       }
       
       // For agent orders, we need to find vouchers by their actual retail price
       // The agent price is discounted, so we need to find vouchers with the original retail price
       if (isAgentOrder) {
         // For agent orders, we need to find vouchers with the original retail price
         // Since we don't have a voucherType table, we'll search for vouchers with any retail price
         // that matches the hours and numberOfUsers, then filter by availability
       } else {
         // For regular orders, use the unit price as provided
         voucherWhere.retailPrice = Number(item.unitPrice)
       }
       
       // For agent orders, we can get vouchers from any location if no specific location is specified
       if (itemLocationId) {
         voucherWhere.locationId = itemLocationId
       }

       // For agent orders, we need to check total availability across all locations
       let availableVouchers
       if (isAgentOrder && !itemLocationId) {
         // Count total available vouchers across all locations for this type
         const totalAvailable = await prisma.voucher.count({
           where: voucherWhere
         })
         
         if (totalAvailable < Number(item.quantity)) {
           throw createError({
             statusCode: 400,
             statusMessage: `Only ${totalAvailable} vouchers available for ${item.hours} hour package across all locations`
           })
         }
         
         // Get the actual vouchers to reserve (from any location)
         availableVouchers = await prisma.voucher.findMany({
           where: voucherWhere,
           take: Number(item.quantity),
           select: {
             id: true,
             hours: true,
             numberOfUsers: true,
             retailPrice: true
           }
         })
       } else {
         // Regular order or agent order with specific location
         availableVouchers = await prisma.voucher.findMany({
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
           const locationText = itemLocationId ? `at location ${itemLocationId}` : 'across all locations'
           throw createError({
             statusCode: 400,
             statusMessage: `Only ${availableVouchers.length} vouchers available for ${item.hours} hour package ${locationText}`
           })
         }
       }

      const lineTotal = Number(item.unitPrice) * Number(item.quantity)
      subtotal += lineTotal
      totalItems += Number(item.quantity)

      // Add voucher IDs to reserve
      vouchersToReserve.push(...availableVouchers.map(v => v.id))

      orderItems.push({
        locationId: itemLocationId || null,
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
      buyerEmail: customerEmail,
      buyerPhone: customerPhone,
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
    const paynow = new Paynow(PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY)

    // Set URLs
    const baseUrl = getRequestURL(event).origin
    paynow.resultUrl = `${baseUrl}/api/payments/paynow/webhook`
    
    console.log('Order creation: Setting webhook URL to:', paynow.resultUrl)
    
    // Set return URL based on order type
    if (isAgentOrder) {
      paynow.returnUrl = `${baseUrl}/agent/purchase-success?orderId=${order.id}&total=${total}`
    } else {
      paynow.returnUrl = `${baseUrl}/vouchers-${order.id}`
    }

    // Create payment
    const payment = paynow.createPayment(paymentReference, customerEmail)
    
         // Add items to payment
     for (const item of orderItems) {
       // Since we don't store voucherType, we'll use a generic description
       payment.add(`WiFi Voucher × ${item.quantity}`, Number(item.lineTotal))
     }

    let response
    if (paymentMethod === 'mobile') {
      // Mobile payment (Ecocash/OneMoney)
      response = await paynow.sendMobile(payment, mobilePhone, mobileProvider)
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

async function createAgentPurchaseFromOrder(orderId: string, agentId: string, orderItems: any[]) {
  try {
    // Get the agent profile for this user
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: agentId }
    })

    if (!agentProfile) {
      console.error('Agent profile not found for user:', agentId)
      return
    }

    // Create AgentPurchase records for each item
    for (const item of orderItems) {
      await prisma.agentPurchase.create({
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
    }
  } catch (error) {
    console.error('Error creating agent purchase from order:', error)
    // Don't throw error here as the order was already created successfully
  }
}
