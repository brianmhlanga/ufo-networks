import { PrismaClient } from '@prisma/client'

/**
 * One Prisma client for the whole server. Each PrismaClient opens its own connection pool, so
 * creating one per route file can exhaust MySQL connections.
 */
const globalForPrisma = globalThis as unknown as { __ufoPrisma?: PrismaClient }

export const prisma = globalForPrisma.__ufoPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__ufoPrisma = prisma
}
