import { prisma } from '~/server/utils/prisma'
import { requireActiveUser } from '~/server/utils/requireRole'

/**
 * Gate every admin and agent API route on the user's current role and status in the database.
 *
 * Individual routes still do their own checks; this guarantees a deactivated, blacklisted or
 * demoted user is cut off on their next request even where a route only looked at the session
 * cookie. The verified user is put on event.context.authUser for routes to use.
 */
export default defineEventHandler(async (event) => {
  const path = event.path || ''

  if (path.startsWith('/api/admin/')) {
    event.context.authUser = await requireActiveUser(event, prisma, ['ADMIN', 'SUPER_ADMIN'])
  } else if (path.startsWith('/api/agent/')) {
    event.context.authUser = await requireActiveUser(event, prisma, ['AGENT'])
  }
})
