import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and has admin role
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get query parameters for filtering
    const query = getQuery(event)
    const locationId = query.locationId as string
    const batchId = query.batchId as string

    // Build where clause for filtering
    const where: any = {}
    
    if (locationId) {
      where.locationId = locationId
    }
    
    if (batchId) {
      where.batchId = batchId
    }

    // Get voucher statistics
    const [
      totalVouchers,
      availableVouchers,
      reservedVouchers,
      soldVouchers,
      redeemedVouchers,
      expiredVouchers,
      disabledVouchers
    ] = await Promise.all([
      // Total vouchers
      prisma.voucher.count({ where }),
      
      // Available vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'AVAILABLE',
          expiryDate: { gt: new Date() }
        } 
      }),
      
      // Reserved vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'RESERVED' 
        } 
      }),
      
      // Sold vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'SOLD' 
        } 
      }),
      
      // Redeemed vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'REDEEMED' 
        } 
      }),
      
      // Expired vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'AVAILABLE',
          expiryDate: { lte: new Date() }
        } 
      }),
      
      // Disabled vouchers
      prisma.voucher.count({ 
        where: { 
          ...where,
          status: 'DISABLED' 
        } 
      })
    ])

    // Get total value of available vouchers
    const availableVouchersValue = await prisma.voucher.aggregate({
      where: { 
        ...where,
        status: 'AVAILABLE',
        expiryDate: { gt: new Date() }
      },
      _sum: {
        retailPrice: true
      }
    })

    // Get total value of sold vouchers
    const soldVouchersValue = await prisma.voucher.aggregate({
      where: { 
        ...where,
        status: 'SOLD'
      },
      _sum: {
        retailPrice: true
      }
    })

    // Get vouchers by location (top 5)
    const vouchersByLocation = await prisma.voucher.groupBy({
      by: ['locationId'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get vouchers by batch (top 5)
    const vouchersByBatch = await prisma.voucher.groupBy({
      by: ['batchId'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get vouchers by status
    const vouchersByStatus = await prisma.voucher.groupBy({
      by: ['status'],
      where,
      _count: {
        id: true
      }
    })

    return {
      totalVouchers,
      availableVouchers,
      reservedVouchers,
      soldVouchers,
      redeemedVouchers,
      expiredVouchers,
      disabledVouchers,
      availableVouchersValue: availableVouchersValue._sum.retailPrice || 0,
      soldVouchersValue: soldVouchersValue._sum.retailPrice || 0,
      vouchersByLocation,
      vouchersByBatch,
      vouchersByStatus
    }
  } catch (error) {
    console.error('Error fetching voucher stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
