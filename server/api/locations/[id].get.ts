import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const locationId = getRouterParam(event, 'id')
    
    if (!locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required'
      })
    }

    // Fetch location details
    const location = await prisma.location.findUnique({
      where: {
        id: locationId
      },
      include: {
        batches: {
          where: {
            active: true
          },
          select: {
            id: true,
            name: true,
            hours: true,
            numberOfUsers: true,
            retailPrice: true
          }
        },
        vouchers: {
          where: {
            status: 'AVAILABLE'
          },
          select: {
            id: true,
            batchId: true
          }
        }
      }
    })

    if (!location) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found'
      })
    }

    // Calculate available voucher counts by batch
    const availableVouchers = location.vouchers.reduce((acc, voucher) => {
      if (voucher.batchId) {
        acc[voucher.batchId] = (acc[voucher.batchId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Add available count to batches
    const batchesWithCounts = location.batches.map(batch => ({
      ...batch,
      availableCount: availableVouchers[batch.id] || 0
    }))

    return {
      success: true,
      data: {
        ...location,
        batches: batchesWithCounts,
        vouchers: undefined // Remove vouchers from response
      }
    }

  } catch (error: any) {
    console.error('Error fetching location:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})