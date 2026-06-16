import { PrismaClient } from '@prisma/client'
import { getAuditActor } from '~/server/utils/auditLog'
import { deleteBatchWithDependencies } from '~/server/utils/deleteLocationCascade'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required',
      })
    }

    const batchId = getRouterParam(event, 'id')
    if (!batchId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Batch ID is required',
      })
    }

    const existingBatch = await prisma.voucherBatch.findUnique({
      where: { id: batchId },
      select: { id: true },
    })

    if (!existingBatch) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found',
      })
    }

    const audit = await getAuditActor(event)

    await prisma.$transaction(async (tx) => {
      await deleteBatchWithDependencies(tx, batchId, audit)
    })

    return {
      success: true,
      message: 'Batch deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting batch:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
