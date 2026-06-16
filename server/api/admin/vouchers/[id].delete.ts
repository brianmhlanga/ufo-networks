import { PrismaClient } from '@prisma/client'
import { getAuditActor } from '~/server/utils/auditLog'
import { deleteVoucherWithDependencies } from '~/server/utils/deleteLocationCascade'

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

    const voucherId = getRouterParam(event, 'id')
    if (!voucherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Voucher ID is required',
      })
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      select: { id: true },
    })

    if (!voucher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Voucher not found',
      })
    }

    const audit = await getAuditActor(event)

    await prisma.$transaction(async (tx) => {
      await deleteVoucherWithDependencies(tx, voucherId, audit)
    })

    return {
      success: true,
      message: 'Voucher deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting voucher:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
