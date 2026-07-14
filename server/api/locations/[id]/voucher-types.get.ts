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

    // Get voucher types available at this location. The data cap is part of what defines a
    // package, so it groups alongside hours/users/price.
    const voucherTypes = await prisma.voucher.groupBy({
      by: ['hours', 'numberOfUsers', 'retailPrice', 'dataLimitGb'],
      where: {
        locationId: locationId,
        status: 'AVAILABLE',
        endDate: { gte: new Date() } // Not expired
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

    // Format the response
    const formattedVoucherTypes = voucherTypes.map(type => ({
      hours: type.hours,
      numberOfUsers: type.numberOfUsers,
      dataLimitGb: type.dataLimitGb,
      retailPrice: type.retailPrice,
      availableCount: type._count.id
    }))

    return {
      success: true,
      data: formattedVoucherTypes
    }

  } catch (error: any) {
    console.error('Error fetching voucher types:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
