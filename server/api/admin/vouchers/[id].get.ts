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

    // Get voucher ID from route params
    const voucherId = getRouterParam(event, 'id')

    if (!voucherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Voucher ID is required'
      })
    }

    // Find the voucher
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
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
            retailPrice: true,
            hours: true,
            numberOfUsers: true
          }
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        assignedToAgent: {
          select: {
            id: true,
            displayName: true,
            defaultDiscountPct: true
          }
        },
        agentSale: {
          select: {
            id: true,
            soldPrice: true,
            buyerPhone: true,
            buyerNote: true,
            createdAt: true
          }
        }
      }
    })

    if (!voucher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Voucher not found'
      })
    }

    return {
      success: true,
      voucher
    }
  } catch (error) {
    console.error('Error fetching voucher:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
