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

    // Get agent sale ID from route params
    const saleId = getRouterParam(event, 'id')

    if (!saleId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent sale ID is required'
      })
    }

    // Check if agent sale exists
    const existingSale = await prisma.agentSale.findUnique({
      where: { id: saleId }
    })

    if (!existingSale) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent sale not found'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { 
      soldPrice, 
      buyerPhone, 
      buyerNote 
    } = body

    // Validation
    if (!soldPrice) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Sold price is required'
      })
    }

    if (soldPrice <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Sold price must be greater than 0'
      })
    }

    // Update agent sale
    const updatedSale = await prisma.agentSale.update({
      where: { id: saleId },
      data: {
        soldPrice: parseFloat(soldPrice),
        buyerPhone: buyerPhone || null,
        buyerNote: buyerNote || null
      },
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
      message: 'Agent sale updated successfully',
      agentSale: updatedSale
    }
  } catch (error) {
    console.error('Error updating agent sale:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
