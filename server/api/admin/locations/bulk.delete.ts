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

    // Get request body
    const body = await readBody(event)
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location IDs array is required'
      })
    }

    // Check if all locations exist and can be deleted
    const locations = await prisma.location.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        _count: {
          select: {
            vouchers: true,
            batches: true,
            adLinks: true,
            agentDiscounts: true,
            orderItems: true
          }
        }
      }
    })

    if (locations.length !== ids.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more locations not found'
      })
    }

    // Check for locations that cannot be deleted
    const locationsWithData = locations.filter(location => 
      location._count.vouchers > 0 ||
      location._count.batches > 0 ||
      location._count.adLinks > 0 ||
      location._count.agentDiscounts > 0 ||
      location._count.orderItems > 0
    )

    if (locationsWithData.length > 0) {
      const locationNames = locationsWithData.map(l => l.name).join(', ')
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete locations with associated data: ${locationNames}`
      })
    }

    // Delete locations
    await prisma.location.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return {
      message: `${ids.length} location(s) deleted successfully`
    }

  } catch (error) {
    console.error('Error bulk deleting locations:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete locations'
    })
  }
})
