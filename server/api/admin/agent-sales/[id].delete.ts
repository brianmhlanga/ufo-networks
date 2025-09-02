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

    // Delete agent sale in a transaction
    await prisma.$transaction(async (tx) => {
      // Update voucher status back to AVAILABLE
      await tx.voucher.update({
        where: { id: existingSale.voucherId },
        data: { status: 'AVAILABLE' }
      })

      // Update agent purchase claimed count
      await tx.agentPurchase.update({
        where: { id: existingSale.agentPurchaseId },
        data: {
          claimedCount: {
            decrement: 1
          }
        }
      })

      // Delete the agent sale
      await tx.agentSale.delete({
        where: { id: saleId }
      })
    })

    return {
      success: true,
      message: 'Agent sale deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting agent sale:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
