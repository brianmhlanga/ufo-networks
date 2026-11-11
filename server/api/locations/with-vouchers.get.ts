import { prisma } from '~/server/utils/prisma'
import { resolveLocationCoords } from '~/utils/locationCoords'

export default defineEventHandler(async (event) => {
  try {
    // ?all=1 returns every location, including ones with no stock (the public locations page
    // lists them all). Without it, only locations with something to buy are returned, which is
    // what the voucher purchase page needs.
    const includeEmpty = ['1', 'true'].includes(String(getQuery(event).all || ''))

    // Get all locations with their available voucher types
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        town: true,
        area: true,
        province: true,
        code: true,
        latitude: true,
        longitude: true,
        meta: true,
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
          coords: resolveLocationCoords(location),
          voucherTypes: formattedVoucherTypes,
          totalVouchers: formattedVoucherTypes.reduce((sum, type) => sum + type.availableCount, 0)
        }
      })
    )

    const activeLocations = includeEmpty
      ? locationsWithVouchers
      : locationsWithVouchers.filter(location => location.totalVouchers > 0)

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
