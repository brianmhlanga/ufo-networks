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
    const { 
      locationId, 
      hours, 
      numberOfUsers, 
      quantity, 
      salePrice, 
      customerName, 
      customerPhone, 
      totalAmount 
    } = body

    // Validate required fields
    if (!locationId || !hours || !numberOfUsers || !quantity || !salePrice || !totalAmount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Check availability again before proceeding
    const vouchersInStock = await prisma.voucher.count({
      where: {
        locationId: locationId,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers),
        status: 'AVAILABLE',
        endDate: { gte: new Date() }
      }
    })

    if (vouchersInStock < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Insufficient vouchers in stock. Available: ${vouchersInStock}, Requested: ${quantity}`
      })
    }

    // Check agent entitlements
    const agentEntitlements = await prisma.agentPurchase.aggregate({
      where: {
        agentId: agentProfile.id,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers)
      },
      _sum: {
        quantity: true
      }
    })

    const totalEntitlements = agentEntitlements._sum.quantity || 0

    // Count already sold vouchers
    const alreadySold = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        agentPurchase: {
          hours: Number(hours),
          numberOfUsers: Number(numberOfUsers)
        }
      }
    })

    const availableForSale = totalEntitlements - alreadySold

    if (availableForSale < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Insufficient entitlements. Available: ${availableForSale}, Requested: ${quantity}`
      })
    }

    // Get available vouchers
    const availableVouchers = await prisma.voucher.findMany({
      where: {
        locationId: locationId,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers),
        status: 'AVAILABLE',
        endDate: { gte: new Date() }
      },
      take: Number(quantity)
    })

    if (availableVouchers.length < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Insufficient vouchers available. Available: ${availableVouchers.length}, Requested: ${quantity}`
      })
    }

    // Find an agent purchase to link this sale to
    const agentPurchase = await prisma.agentPurchase.findFirst({
      where: {
        agentId: agentProfile.id,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers)
      }
    })

    if (!agentPurchase) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No agent purchase found for this entitlement'
      })
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const sales = []
      const createdVouchers = []

      // Process each voucher
      for (let i = 0; i < quantity; i++) {
        const voucher = availableVouchers[i]
        
        // Mark voucher as redeemed
        const updatedVoucher = await tx.voucher.update({
          where: { id: voucher.id },
          data: {
            status: 'REDEEMED',
            assignedToAgentId: agentProfile.id,
            soldAt: new Date(),
            redeemedAt: new Date()
          },
          include: {
            location: true
          }
        })

        // Create agent sale record
        const sale = await tx.agentSale.create({
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
        
        // Add voucher details for the success modal
        createdVouchers.push({
          id: updatedVoucher.id,
          voucherNumber: updatedVoucher.voucherNumber,
          pin: updatedVoucher.pin,
          hours: updatedVoucher.hours,
          numberOfUsers: updatedVoucher.numberOfUsers,
          endDate: updatedVoucher.endDate,
          location: updatedVoucher.location
        })
      }

      // Update agent purchase claimed count
      await tx.agentPurchase.update({
        where: { id: agentPurchase.id },
        data: {
          claimedCount: {
            increment: quantity
          }
        }
      })

      return { sales, createdVouchers }
    })

    return {
      success: true,
      message: 'Sale created successfully',
      data: {
        id: result.sales[0].id,
        quantity: result.sales.length,
        totalAmount: totalAmount,
        saleDate: new Date(),
        vouchers: result.createdVouchers
      }
    }

  } catch (error: any) {
    console.error('Error creating sale:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
