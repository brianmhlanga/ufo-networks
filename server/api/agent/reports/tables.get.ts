import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getUserSession(event)
    
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get agent profile
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Agent profile not found'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const { dateRange, locationId, voucherType } = query

    // Build date filter
    let dateFilter = {}
    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate = new Date()
      
      switch (dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7)
          break
        case '30days':
          startDate.setDate(now.getDate() - 30)
          break
        case '90days':
          startDate.setDate(now.getDate() - 90)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }
      
      dateFilter = {
        createdAt: {
          gte: startDate
        }
      }
    }

    // Build location filter
    let locationFilter = {}
    if (locationId && locationId !== 'all') {
      locationFilter = {
        voucher: {
          locationId: locationId as string
        }
      }
    }

    // Build voucher type filter
    let voucherTypeFilter = {}
    if (voucherType && voucherType !== 'all') {
      const [hours, numberOfUsers] = (voucherType as string).split('-').map(Number)
      voucherTypeFilter = {
        voucher: {
          hours,
          numberOfUsers
        }
      }
    }

    // 1. Top Performing Locations
    const topLocations = await getTopPerformingLocations(agentProfile.id, dateFilter, voucherTypeFilter)

    // 2. Recent Sales Activity
    const recentSales = await getRecentSales(agentProfile.id, dateFilter, locationFilter, voucherTypeFilter)

    return {
      success: true,
      data: {
        topLocations,
        recentSales
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent tables data:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})

// Helper function to get top performing locations
async function getTopPerformingLocations(agentId: string, dateFilter: any, voucherTypeFilter: any) {
  const locationSales = await prisma.agentSale.groupBy({
    by: ['voucherId'],
    where: {
      agentId,
      ...dateFilter,
      ...voucherTypeFilter
    },
    _sum: {
      soldPrice: true
    },
    _count: true
  })

  const locationData = await Promise.all(
    locationSales.map(async (sale) => {
      const voucher = await prisma.voucher.findUnique({
        where: { id: sale.voucherId },
        include: { location: true }
      })
      return {
        location: voucher?.location?.name || 'Unknown',
        sales: sale._count,
        revenue: Number(sale._sum?.soldPrice || 0)
      }
    })
  )

  // Group by location and calculate profit
  const groupedData = locationData.reduce((acc, item) => {
    if (acc[item.location]) {
      acc[item.location].sales += item.sales
      acc[item.location].revenue += item.revenue
    } else {
      acc[item.location] = { sales: item.sales, revenue: item.revenue }
    }
    return acc
  }, {} as Record<string, { sales: number; revenue: number }>)

  // Calculate profit for each location
  const locationsWithProfit = await Promise.all(
    Object.entries(groupedData).map(async ([locationName, data]) => {
      // Get agent purchases for this location to calculate profit
      const locationSales = await prisma.agentSale.findMany({
        where: {
          agentId,
          voucher: {
            location: {
              name: locationName
            }
          },
          ...dateFilter,
          ...voucherTypeFilter
        },
        include: {
          agentPurchase: {
            select: {
              unitCost: true
            }
          }
        }
      })

      const profit = locationSales.reduce((sum, sale) => {
        const sellingPrice = Number(sale.soldPrice)
        const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
        return sum + (sellingPrice - buyingPrice)
      }, 0)

      return {
        location: locationName,
        sales: data.sales,
        revenue: data.revenue,
        profit
      }
    })
  )

  // Sort by revenue and return top 10
  return locationsWithProfit
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

// Helper function to get recent sales activity
async function getRecentSales(agentId: string, dateFilter: any, locationFilter: any, voucherTypeFilter: any) {
  const recentSales = await prisma.agentSale.findMany({
    where: {
      agentId,
      ...dateFilter,
      ...locationFilter,
      ...voucherTypeFilter
    },
    include: {
      voucher: true,
      agentPurchase: {
        select: {
          unitCost: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  })

  return recentSales.map(sale => {
    const sellingPrice = Number(sale.soldPrice)
    const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
    const profit = sellingPrice - buyingPrice

    return {
      date: sale.createdAt,
      voucherType: `${sale.voucher.hours}H, ${sale.voucher.numberOfUsers}U`,
      amount: sellingPrice,
      profit
    }
  })
}
