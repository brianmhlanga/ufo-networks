import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Fetch distinct voucher types from batches
    const voucherTypes = await prisma.voucherBatch.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        retailPrice: true,
        hours: true,
        numberOfUsers: true,
        startDate: true,
        endDate: true,
        _count: {
          select: {
            vouchers: {
              where: {
                status: { in: ['AVAILABLE', 'RESERVED'] },
                endDate: { gte: new Date() },
                startDate: { lte: new Date() }
              }
            }
          }
        }
      },
      orderBy: {
        hours: 'asc'
      }
    })

    // Group by hours to get unique voucher types
    const uniqueTypes = new Map()
    
    voucherTypes.forEach(batch => {
      const key = `${batch.hours}_${batch.numberOfUsers}`
      if (!uniqueTypes.has(key) || batch._count.vouchers > 0) {
        uniqueTypes.set(key, {
          id: batch.id,
          name: batch.name,
          hours: batch.hours,
          numberOfUsers: batch.numberOfUsers,
          retailPrice: Number(batch.retailPrice),
          availableCount: batch._count.vouchers,
          startDate: batch.startDate,
          endDate: batch.endDate
        })
      }
    })

    // Transform to package format
    const packages = Array.from(uniqueTypes.values()).map(voucherType => {
      // Determine package type based on hours
      let packageType = 'hour'
      let displayName = `${voucherType.hours} Hour${voucherType.hours > 1 ? 's' : ''}`
      let description = 'Quick browsing session'
      
      if (voucherType.hours >= 24) {
        packageType = 'day'
        const days = Math.floor(voucherType.hours / 24)
        displayName = `${days} Day${days > 1 ? 's' : ''}`
        description = days === 1 ? 'Full day access' : 'Extended access'
      } else if (voucherType.hours >= 168) { // 7 days
        packageType = 'weekly'
        const weeks = Math.floor(voucherType.hours / 168)
        displayName = `${weeks} Week${weeks > 1 ? 's' : ''}`
        description = 'Unlimited access'
      }

      // Calculate validity period (simplified)
      const validityDays = voucherType.hours <= 24 ? 1 : voucherType.hours <= 168 ? 7 : 30

      return {
        id: voucherType.id,
        name: displayName,
        originalName: voucherType.name,
        hours: voucherType.hours,
        price: voucherType.retailPrice,
        numberOfUsers: voucherType.numberOfUsers,
        packageType,
        description,
        validityDays,
        availableCount: voucherType.availableCount,
        isAvailable: voucherType.availableCount > 0,
        features: [
          `${voucherType.hours} hour${voucherType.hours > 1 ? 's' : ''} access`,
          `Up to ${voucherType.numberOfUsers} device${voucherType.numberOfUsers > 1 ? 's' : ''}`,
          `Valid ${validityDays} day${validityDays > 1 ? 's' : ''}`
        ]
      }
    })

    // Sort by hours
    packages.sort((a, b) => a.hours - b.hours)

    return {
      success: true,
      data: packages,
      total: packages.length
    }
  } catch (error) {
    console.error('Error fetching voucher packages:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
