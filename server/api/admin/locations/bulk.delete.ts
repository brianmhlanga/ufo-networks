import { PrismaClient } from '@prisma/client'
import { getAuditActor } from '~/server/utils/auditLog'
import { deleteLocationWithDependencies } from '~/server/utils/deleteLocationCascade'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required',
      })
    }

    const body = await readBody(event)
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location IDs array is required',
      })
    }

    const locations = await prisma.location.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    })

    if (locations.length !== ids.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more locations not found',
      })
    }

    const audit = await getAuditActor(event)

    await prisma.$transaction(async (tx) => {
      for (const location of locations) {
        await deleteLocationWithDependencies(tx, location.id, audit)
      }
    })

    return {
      message: `${ids.length} location(s) deleted successfully`,
    }
  } catch (error) {
    console.error('Error bulk deleting locations:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete locations',
    })
  }
})
