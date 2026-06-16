import { PrismaClient } from '@prisma/client'
import { getAuditActor, writeAuditLog } from '~/server/utils/auditLog'

const prisma = new PrismaClient()

const ALLOWED_STATUSES = ['ACTIVE', 'INACTIVE', 'BLACKLISTED'] as const

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required',
      })
    }

    const userId = getRouterParam(event, 'id')
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      })
    }

    const body = await readBody(event)
    const { status } = body

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid status is required (ACTIVE, INACTIVE, or BLACKLISTED)',
      })
    }

    if (userId === session.user.id && status !== 'ACTIVE') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot change the status of your own account',
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    if (existingUser.status === status) {
      throw createError({
        statusCode: 400,
        statusMessage: `User is already ${status.toLowerCase()}`,
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: { agentProfile: true },
    })

    const audit = await getAuditActor(event)
    await writeAuditLog(prisma, {
      ...audit,
      action: 'USER_STATUS_CHANGED',
      entity: 'User',
      entityId: userId,
      details: {
        before: existingUser.status,
        after: status,
        email: existingUser.email,
        role: existingUser.role,
      },
    })

    return {
      success: true,
      message: status === 'ACTIVE'
        ? 'User enabled successfully'
        : 'User disabled successfully',
      user: updatedUser,
    }
  } catch (error: any) {
    console.error('Error updating user status:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user status',
    })
  }
})
