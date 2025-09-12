import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { locationId } = query

    if (!locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Location ID is required'
      })
    }

    // Get available vouchers directly from the voucher table, grouped by their properties
    const availableVouchers = await prisma.voucher.findMany({
      where: {
        locationId: locationId as string,
        status: 'AVAILABLE',
        endDate: { gte: new Date() }
      },
      select: {
        id: true,
        hours: true,
        numberOfUsers: true,
        retailPrice: true,
        endDate: true,
        batchId: true,
        batch: {
          select: {
            name: true
          }
        }
      },
      orderBy: { hours: 'asc' }
    })

    // Group vouchers by their properties to show available quantities
    const voucherGroups = new Map<string, any>()

    for (const voucher of availableVouchers) {
      const key = `${voucher.hours}_${voucher.numberOfUsers}_${voucher.retailPrice}`
      
      if (voucherGroups.has(key)) {
        voucherGroups.get(key).availableCount++
      } else {
        voucherGroups.set(key, {
          id: voucher.id, // Use first voucher ID as representative
          hours: voucher.hours,
          numberOfUsers: voucher.numberOfUsers,
          retailPrice: voucher.retailPrice,
          endDate: voucher.endDate,
          availableCount: 1,
          batchName: voucher.batch?.name || 'Standard'
        })
      }
    }

    // Convert to array and sort by hours
    const vouchers = Array.from(voucherGroups.values()).sort((a, b) => a.hours - b.hours)

    return {
      success: true,
      vouchers
    }

  } catch (error: any) {
    console.error('Error fetching available vouchers:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch available vouchers'
    })
  }
})
