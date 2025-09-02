import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and has admin role
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { 
      agentId, 
      agentPurchaseId, 
      voucherId, 
      soldPrice, 
      buyerPhone, 
      buyerNote 
    } = body

    // Validation
    if (!agentId || !agentPurchaseId || !voucherId || !soldPrice) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent ID, agent purchase ID, voucher ID, and sold price are required'
      })
    }

    if (soldPrice <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Sold price must be greater than 0'
      })
    }

    // Validate agent exists
    const agent = await prisma.agentProfile.findUnique({
      where: { id: agentId }
    })

    if (!agent) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid agent ID'
      })
    }

    // Validate agent purchase exists
    const agentPurchase = await prisma.agentPurchase.findUnique({
      where: { id: agentPurchaseId }
    })

    if (!agentPurchase) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid agent purchase ID'
      })
    }

    // Validate voucher exists and is available
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    })

    if (!voucher) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid voucher ID'
      })
    }

    if (voucher.status !== 'AVAILABLE') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Voucher is not available for sale'
      })
    }

    // Check if voucher is already sold
    const existingSale = await prisma.agentSale.findUnique({
      where: { voucherId }
    })

    if (existingSale) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Voucher is already sold'
      })
    }

    // Create agent sale in a transaction
    const agentSale = await prisma.$transaction(async (tx) => {
      // Create the agent sale
      const newSale = await tx.agentSale.create({
        data: {
          agentId,
          agentPurchaseId,
          voucherId,
          soldPrice: parseFloat(soldPrice),
          buyerPhone: buyerPhone || null,
          buyerNote: buyerNote || null
        }
      })

      // Update voucher status to SOLD
      await tx.voucher.update({
        where: { id: voucherId },
        data: { status: 'SOLD' }
      })

      // Update agent purchase claimed count
      await tx.agentPurchase.update({
        where: { id: agentPurchaseId },
        data: {
          claimedCount: {
            increment: 1
          }
        }
      })

      return newSale
    })

    // Fetch the created sale with all related data
    const saleWithDetails = await prisma.agentSale.findUnique({
      where: { id: agentSale.id },
      include: {
        agent: {
          select: {
            id: true,
            displayName: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        agentPurchase: {
          select: {
            id: true,
            quantity: true,
            unitCost: true,
            totalCost: true,
            claimedCount: true,
            location: {
              select: {
                id: true,
                name: true,
                code: true
              }
            },
            batch: {
              select: {
                id: true,
                name: true,
                notes: true
              }
            }
          }
        },
        voucher: {
          select: {
            id: true,
            voucherNumber: true,
            pin: true,
            status: true,
            retailPrice: true,
            hours: true,
            numberOfUsers: true,
            startDate: true,
            endDate: true,
            expiryDate: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Agent sale created successfully',
      agentSale: saleWithDetails
    }
  } catch (error) {
    console.error('Error creating agent sale:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
