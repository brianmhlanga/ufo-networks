import { PrismaClient } from '@prisma/client'
import { requireAdminUser } from '~/server/utils/auditLog'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    await requireAdminUser(event, prisma)

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = Math.min(parseInt(query.limit as string) || 25, 100)
    const search = (query.search as string) || ''
    const action = (query.action as string) || ''
    const entity = (query.entity as string) || ''
    const dateFrom = query.dateFrom as string | undefined
    const dateTo = query.dateTo as string | undefined

    const where: Record<string, unknown> = {}

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(`${dateTo}T23:59:59.999Z`) } : {}),
      }
    }

    if (search) {
      where.OR = [
        { action: { contains: search } },
        { entity: { contains: search } },
        { entityId: { contains: search } },
        { ip: { contains: search } },
        { actor: { is: { name: { contains: search } } } },
        { actor: { is: { email: { contains: search } } } },
      ]
    }

    const offset = (page - 1) * limit

    const [total, logs, actionGroups, entityGroups] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
        orderBy: { action: 'asc' },
      }),
      prisma.auditLog.groupBy({
        by: ['entity'],
        where: { entity: { not: null } },
        _count: { entity: true },
        orderBy: { entity: 'asc' },
      }),
    ])

    return {
      success: true,
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        actions: actionGroups.map((group) => group.action),
        entities: entityGroups
          .map((group) => group.entity)
          .filter((value): value is string => Boolean(value)),
      },
    }
  } catch (error: any) {
    console.error('Error fetching audit logs:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch audit logs',
    })
  }
})
