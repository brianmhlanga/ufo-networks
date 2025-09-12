import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is admin
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required'
      })
    }

    // Fetch all active locations for dropdowns
    const locations = await prisma.location.findMany({
      where: {
        // Only get active locations
        vouchers: {
          some: {
            status: 'AVAILABLE'
          }
        }
      },
      select: {
        id: true,
        name: true,
        code: true,
        town: true,
        area: true,
        province: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      locations
    }

  } catch (error) {
    console.error('Error fetching all locations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch locations'
    })
  }
})
