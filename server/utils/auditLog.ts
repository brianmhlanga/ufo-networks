import type { H3Event } from 'h3'
import type { PrismaClient } from '@prisma/client'

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export type AuditContext = {
  actorId?: string | null
  ip?: string | null
}

export function serializeForAudit(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object' && value !== null) {
    if (typeof (value as { toNumber?: () => number }).toNumber === 'function') {
      return Number(value)
    }

    if (Array.isArray(value)) {
      return value.map(serializeForAudit)
    }

    const output: Record<string, unknown> = {}
    for (const [key, nestedValue] of Object.entries(value)) {
      output[key] = serializeForAudit(nestedValue)
    }
    return output
  }

  return value
}

export function getRequestIp(event: H3Event): string | undefined {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim()
  }

  return getRequestIP(event) ?? undefined
}

export async function getAuditActor(event: H3Event): Promise<AuditContext> {
  const session = await getUserSession(event)

  return {
    actorId: session?.user?.id ?? null,
    ip: getRequestIp(event) ?? null,
  }
}

export async function writeAuditLog(
  db: PrismaTx | PrismaClient,
  input: {
    actorId?: string | null
    action: string
    entity?: string | null
    entityId?: string | null
    details?: unknown
    ip?: string | null
  },
) {
  await db.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity ?? null,
      entityId: input.entityId ?? null,
      details: input.details ? serializeForAudit(input.details) as object : undefined,
      ip: input.ip ?? null,
    },
  })
}

export async function requireAdminUser(event: H3Event, prisma: PrismaClient) {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true, email: true },
  })

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  return user
}
