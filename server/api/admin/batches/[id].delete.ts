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

    // Get batch ID from route params
    const batchId = getRouterParam(event, 'id')

    if (!batchId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Batch ID is required'
      })
    }

    // Check if batch exists
    const existingBatch = await prisma.voucherBatch.findUnique({
      where: { id: batchId }
    })

    if (!existingBatch) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found'
      })
    }

    // Check if batch has vouchers (optional safety check)
    const voucherCount = await prisma.voucher.count({
      where: { batchId }
    })

    if (voucherCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete batch. It has ${voucherCount} associated vouchers.`
      })
    }

    // Delete batch
    await prisma.voucherBatch.delete({
      where: { id: batchId }
    })

    return {
      success: true,
      message: 'Batch deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting batch:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
