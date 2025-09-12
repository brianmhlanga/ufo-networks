import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const locationCode = getRouterParam(event, 'code')
    
    if (!locationCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location code is required'
      })
    }

    // Fetch location details by code
    const location = await prisma.location.findUnique({
      where: {
        code: locationCode
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
    console.error('Error fetching location by code:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
