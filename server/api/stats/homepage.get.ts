import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Fetch homepage statistics
    const [
      totalLocations,
      activeLocations,
      totalUsers,
      totalRevenue,
      totalVouchers,
      activeVouchers
    ] = await Promise.all([
      // Total locations
      prisma.location.count(),
      
      // Active locations (with available vouchers)
      prisma.location.count({
        where: { 
          vouchers: { 
            some: { 
              status: { in: ['AVAILABLE', 'RESERVED'] },
              endDate: { gte: new Date() },
              startDate: { lte: new Date() }
            } 
          } 
        }
      }),
      
      // Total users (customers + agents)
      prisma.user.count({
        where: {
          role: { in: ['CUSTOMER', 'AGENT'] }
        }
      }),
      
      // Total revenue from orders and agent sales
      prisma.$transaction([
        prisma.order.aggregate({
          where: { status: 'PAID' },
          _sum: { total: true }
        }),
        prisma.agentSale.aggregate({
          _sum: { soldPrice: true }
        })
      ]),
      
      // Total vouchers created
      prisma.voucher.count(),
      
      // Active vouchers (available and reserved)
      prisma.voucher.count({
        where: { 
          status: { in: ['AVAILABLE', 'RESERVED'] },
          endDate: { gte: new Date() },
          startDate: { lte: new Date() }
        }
      })
    ])

    // Calculate total revenue
    const orderRevenue = Number(totalRevenue[0]._sum.total || 0)
    const agentSaleRevenue = Number(totalRevenue[1]._sum.soldPrice || 0)
    const totalRevenueAmount = orderRevenue + agentSaleRevenue

    // Calculate network uptime (simplified - could be more sophisticated)
    const uptimePercentage = 99.9 // This could be calculated from actual monitoring data

    return {
      success: true,
      data: {
        locations: {
          total: totalLocations,
          active: activeLocations
        },
        users: {
          total: totalUsers
        },
        revenue: {
          total: totalRevenueAmount
        },
        vouchers: {
          total: totalVouchers,
          active: activeVouchers
        },
        uptime: uptimePercentage
      }
    }

  } catch (error: any) {
    console.error('Error fetching homepage stats:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
