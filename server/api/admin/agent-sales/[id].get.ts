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

    // Fetch agent sale with all related data
    const agentSale = await prisma.agentSale.findUnique({
      where: { id: saleId },
      include: {
        agent: {
          select: {
            id: true,
            displayName: true,
            defaultDiscountPct: true,
            cashOnly: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true
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
            notes: true,
            location: {
              select: {
                id: true,
                name: true,
                code: true,
                town: true,
                area: true,
                province: true
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
            expiryDate: true,
            createdAt: true
          }
        }
      }
    })

    if (!agentSale) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent sale not found'
      })
    }

    return {
      success: true,
      agentSale
    }
  } catch (error) {
    console.error('Error fetching agent sale:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
