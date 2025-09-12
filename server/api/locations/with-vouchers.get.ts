import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get all locations with their available voucher types
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        town: true,
        area: true,
        province: true,
        code: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // For each location, get available voucher types
    const locationsWithVouchers = await Promise.all(
      locations.map(async (location) => {
        // Get voucher types available at this location
        const voucherTypes = await prisma.voucher.groupBy({
          by: ['hours', 'numberOfUsers', 'retailPrice'],
          where: {
            locationId: location.id,
            status: 'AVAILABLE',
            endDate: { gte: new Date() }, // Not expired
            startDate: { lte: new Date() } // Already started
          },
          _count: {
            id: true
          },
          having: {
            id: {
              _count: {
                gt: 0
              }
            }
          }
        })

        // Format voucher types
        const formattedVoucherTypes = voucherTypes.map(type => ({
          hours: type.hours,
          numberOfUsers: type.numberOfUsers,
          retailPrice: type.retailPrice,
          availableCount: type._count.id
        }))

        return {
          ...location,
          voucherTypes: formattedVoucherTypes,
          totalVouchers: formattedVoucherTypes.reduce((sum, type) => sum + type.availableCount, 0)
        }
      })
    )

    // Filter out locations with no available vouchers
    const activeLocations = locationsWithVouchers.filter(location => location.totalVouchers > 0)

    return {
      success: true,
      data: activeLocations,
      total: activeLocations.length
    }

  } catch (error: any) {
    console.error('Error fetching locations with vouchers:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
