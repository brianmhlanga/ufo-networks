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

    // Check if voucher exists
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        agentSale: true
      }
    })

    if (!voucher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Voucher not found'
      })
    }

    // Check if voucher can be deleted (not sold or redeemed)
    if (voucher.status === 'SOLD' || voucher.status === 'REDEEMED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete sold or redeemed vouchers'
      })
    }

    // Check if voucher has associated agent sales
    if (voucher.agentSale) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete voucher with associated agent sales'
      })
    }

    // Delete voucher
    await prisma.voucher.delete({
      where: { id: voucherId }
    })

    return {
      success: true,
      message: 'Voucher deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting voucher:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
