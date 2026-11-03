import type { H3Event } from 'h3'
import type { PrismaClient } from '@prisma/client'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'CUSTOMER'

/**
 * Load the signed-in user from the database and check they are still ACTIVE and hold one of
 * the given roles.
 *
 * The role and status are read from the database, not from the session cookie, so a user who is
 * demoted, deactivated or blacklisted loses access on their next request rather than when their
 * session expires.
 */
export async function requireActiveUser(
  event: H3Event,
  prisma: PrismaClient,
  roles?: Role[],
) {
  const session = await getUserSession(event)
  const userId = (session?.user as any)?.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, status: true, name: true, email: true },
  })

  if (!user || user.status !== 'ACTIVE') {
    throw createError({ statusCode: 403, statusMessage: 'Account is not active' })
  }

  if (roles && !roles.includes(user.role as Role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return user
}

export function requireAdmin(event: H3Event, prisma: PrismaClient) {
  return requireActiveUser(event, prisma, ['ADMIN', 'SUPER_ADMIN'])
}

export function requireSuperAdmin(event: H3Event, prisma: PrismaClient) {
  return requireActiveUser(event, prisma, ['SUPER_ADMIN'])
}
