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

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required',
      })
    }

    const existingLocation = await prisma.location.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!existingLocation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found',
      })
    }

    const audit = await getAuditActor(event)

    await prisma.$transaction(async (tx) => {
      await deleteLocationWithDependencies(tx, id, audit)
    })

    return {
      message: 'Location deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting location:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete location',
    })
  }
})
