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

    // Get location ID from params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required'
      })
    }

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id },
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

    if (!existingLocation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found'
      })
    }

    // Check if location has associated data that would prevent deletion
    const hasAssociatedData = 
      existingLocation._count.vouchers > 0 ||
      existingLocation._count.batches > 0 ||
      existingLocation._count.adLinks > 0 ||
      existingLocation._count.agentDiscounts > 0 ||
      existingLocation._count.orderItems > 0

    if (hasAssociatedData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete location with associated vouchers, batches, ads, or orders'
      })
    }

    // Delete location
    await prisma.location.delete({
      where: { id }
    })

    return {
      message: 'Location deleted successfully'
    }

  } catch (error) {
    console.error('Error deleting location:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete location'
    })
  }
})
