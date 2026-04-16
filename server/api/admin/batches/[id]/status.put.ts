import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
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

    const batchId = getRouterParam(event, 'id')
    if (!batchId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Batch ID is required'
      })
    }

    const body = await readBody(event)
    const { active } = body

    if (typeof active !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Active status must be a boolean'
      })
    }

    const existingBatch = await prisma.voucherBatch.findUnique({
      where: { id: batchId },
      select: { id: true }
    })

    if (!existingBatch) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found'
      })
    }

    const batch = await prisma.voucherBatch.update({
      where: { id: batchId },
      data: { active }
    })

    return {
      success: true,
      message: `Batch ${active ? 'activated' : 'deactivated'} successfully`,
      batch
    }
  } catch (error: any) {
    console.error('Error updating batch status:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
