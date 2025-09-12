import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getUserSession(event)
    
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Agent profile not found'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { entitlementId, quantity, salePrice, customerName, customerPhone, totalAmount } = body

    // Validate required fields
    if (!entitlementId || !quantity || !salePrice || !totalAmount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Parse entitlement ID to get voucher type details
    // The entitlement ID is now always in format "hours-numberOfUsers"
    const [hours, numberOfUsers] = entitlementId.split('-').map(Number)
    if (!hours || !numberOfUsers) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid entitlement ID format'
      })
    }

    // Find available vouchers by hours and numberOfUsers
    const availableVouchers = await prisma.voucher.findMany({
      where: {
        hours: hours,
        numberOfUsers: numberOfUsers,
        status: 'AVAILABLE'
      },
      take: quantity
    })

    if (availableVouchers.length < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Insufficient vouchers available. Available: ${availableVouchers.length}, Requested: ${quantity}`
      })
    }

    // Check if agent has enough entitlements
    // Count entitlements by hours and numberOfUsers directly from AgentPurchase
    const batchEntitlements = await prisma.agentPurchase.aggregate({
      where: {
        agentId: agentProfile.id,
        hours: hours,
        numberOfUsers: numberOfUsers
      },
      _sum: {
        quantity: true
      }
    })
    const totalEntitlements = batchEntitlements._sum.quantity || 0
    
    // Count sales by voucher type using agent purchase
    const totalSold = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        agentPurchase: {
          hours: hours,
          numberOfUsers: numberOfUsers
        }
      }
    })

    const availableQuantity = totalEntitlements - totalSold

    if (availableQuantity < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Insufficient entitlements. Available: ${availableQuantity}, Requested: ${quantity}`
      })
    }

    // Find an agent purchase to link this sale to
    const agentPurchase = await prisma.agentPurchase.findFirst({
      where: {
        agentId: agentProfile.id,
        hours: hours,
        numberOfUsers: numberOfUsers
      }
    })

    if (!agentPurchase) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No agent purchase found for this entitlement'
      })
    }

    // Record the sale for each voucher
    const sales = []
    for (let i = 0; i < quantity; i++) {
      const voucher = availableVouchers[i]
      
      // Mark voucher as sold
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: {
          status: 'SOLD',
          assignedToAgentId: agentProfile.id,
          soldAt: new Date()
        }
      })

      // Create agent sale record
      const sale = await prisma.agentSale.create({
        data: {
          agentId: agentProfile.id,
          agentPurchaseId: agentPurchase.id,
          voucherId: voucher.id,
          soldPrice: salePrice,
          buyerPhone: customerPhone || null,
          buyerNote: customerName || null
        }
      })
      
      sales.push(sale)
    }

    return {
      success: true,
      message: 'Sale recorded successfully',
      data: {
        id: sales[0].id,
        quantity: sales.length,
        totalAmount: totalAmount,
        saleDate: new Date()
      }
    }

  } catch (error: any) {
    console.error('Error recording agent sale:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
