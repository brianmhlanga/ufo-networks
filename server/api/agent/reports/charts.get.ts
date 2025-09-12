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

    // 1. Sales Trend Chart (last 30 days by default)
    const salesTrend = await getSalesTrend(agentProfile.id, dateFilter, locationFilter, voucherTypeFilter)

    // 2. Sales by Location Chart
    const locationSales = await getLocationSales(agentProfile.id, dateFilter, voucherTypeFilter)

    // 3. Voucher Type Performance Chart
    const voucherTypePerformance = await getVoucherTypePerformance(agentProfile.id, dateFilter, locationFilter)

    // 4. Profit by Voucher Type Chart
    const profitByType = await getProfitByVoucherType(agentProfile.id, dateFilter, locationFilter)

    // 5. Monthly Performance Chart
    const monthlyPerformance = await getMonthlyPerformance(agentProfile.id, locationFilter, voucherTypeFilter)

    // 6. Entitlements vs Sales Chart
    const entitlementsVsSales = await getEntitlementsVsSales(agentProfile.id, locationFilter, voucherTypeFilter)

    return {
      success: true,
      data: {
        salesTrend,
        locationSales,
        voucherTypePerformance,
        profitByType,
        monthlyPerformance,
        entitlementsVsSales
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent charts data:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})

// Helper function to get sales trend
async function getSalesTrend(agentId: string, dateFilter: any, locationFilter: any, voucherTypeFilter: any) {
  const days = 30
  const labels = []
  const sales = []
  const revenue = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const daySales = await prisma.agentSale.count({
      where: {
        agentId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        ...locationFilter,
        ...voucherTypeFilter
      }
    })

    const dayRevenue = await prisma.agentSale.aggregate({
      where: {
        agentId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        ...locationFilter,
        ...voucherTypeFilter
      },
      _sum: {
        soldPrice: true
      }
    })

    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    sales.push(daySales)
    revenue.push(Number(dayRevenue._sum.soldPrice || 0))
  }

  return { labels, sales, revenue }
}

// Helper function to get sales by location
async function getLocationSales(agentId: string, dateFilter: any, voucherTypeFilter: any) {
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

  // Group by location
  const groupedData = locationData.reduce((acc, item) => {
    if (acc[item.location]) {
      acc[item.location].sales += item.sales
      acc[item.location].revenue += item.revenue
    } else {
      acc[item.location] = { sales: item.sales, revenue: item.revenue }
    }
    return acc
  }, {} as Record<string, { sales: number; revenue: number }>)

  const labels = Object.keys(groupedData)
  const data = Object.values(groupedData).map(item => item.revenue)

  return { labels, data }
}

// Helper function to get voucher type performance
async function getVoucherTypePerformance(agentId: string, dateFilter: any, locationFilter: any) {
  const voucherTypes = await prisma.agentSale.groupBy({
    by: ['voucherId'],
    where: {
      agentId,
      ...dateFilter,
      ...locationFilter
    },
    _sum: {
      soldPrice: true
    },
    _count: true
  })

  const typeData = await Promise.all(
    voucherTypes.map(async (sale) => {
      const voucher = await prisma.voucher.findUnique({
        where: { id: sale.voucherId }
      })
      return {
        type: `${voucher?.hours}H, ${voucher?.numberOfUsers}U`,
        sales: sale._count,
        revenue: Number(sale._sum?.soldPrice || 0)
      }
    })
  )

  // Group by voucher type
  const groupedData = typeData.reduce((acc, item) => {
    if (acc[item.type]) {
      acc[item.type].sales += item.sales
      acc[item.type].revenue += item.revenue
    } else {
      acc[item.type] = { sales: item.sales, revenue: item.revenue }
    }
    return acc
  }, {} as Record<string, { sales: number; revenue: number }>)

  const labels = Object.keys(groupedData)
  const sales = Object.values(groupedData).map(item => item.sales)
  const revenue = Object.values(groupedData).map(item => item.revenue)

  return { labels, sales, revenue }
}

// Helper function to get profit by voucher type
async function getProfitByVoucherType(agentId: string, dateFilter: any, locationFilter: any) {
  const salesWithCosts = await prisma.agentSale.findMany({
    where: {
      agentId,
      ...dateFilter,
      ...locationFilter
    },
    include: {
      agentPurchase: {
        select: {
          unitCost: true
        }
      },
      voucher: true
    }
  })

  const profitByType = salesWithCosts.reduce((acc, sale) => {
    const type = `${sale.voucher.hours}H, ${sale.voucher.numberOfUsers}U`
    const sellingPrice = Number(sale.soldPrice)
    const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
    const profit = sellingPrice - buyingPrice

    if (acc[type]) {
      acc[type] += profit
    } else {
      acc[type] = profit
    }
    return acc
  }, {} as Record<string, number>)

  const labels = Object.keys(profitByType)
  const data = Object.values(profitByType)

  return { labels, data }
}

// Helper function to get monthly performance
async function getMonthlyPerformance(agentId: string, locationFilter: any, voucherTypeFilter: any) {
  const months = 12
  const labels = []
  const sales = []
  const revenue = []
  const profit = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

    const monthSales = await prisma.agentSale.count({
      where: {
        agentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        ...locationFilter,
        ...voucherTypeFilter
      }
    })

    const monthRevenue = await prisma.agentSale.aggregate({
      where: {
        agentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        ...locationFilter,
        ...voucherTypeFilter
      },
      _sum: {
        soldPrice: true
      }
    })

    const monthSalesWithCosts = await prisma.agentSale.findMany({
      where: {
        agentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        ...locationFilter,
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

    const monthProfit = monthSalesWithCosts.reduce((sum, sale) => {
      const sellingPrice = Number(sale.soldPrice)
      const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
      return sum + (sellingPrice - buyingPrice)
    }, 0)

    labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
    sales.push(monthSales)
    revenue.push(Number(monthRevenue._sum.soldPrice || 0))
    profit.push(monthProfit)
  }

  return { labels, sales, revenue, profit }
}

// Helper function to get entitlements vs sales
async function getEntitlementsVsSales(agentId: string, locationFilter: any, voucherTypeFilter: any) {
  const months = 6
  const labels = []
  const entitlements = []
  const sales = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

    // Get entitlements for this month
    const monthEntitlements = await prisma.agentPurchase.aggregate({
      where: {
        agentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        ...(locationFilter.voucher?.locationId ? { locationId: locationFilter.voucher.locationId } : {}),
        ...(voucherTypeFilter.voucher?.hours ? {
          hours: voucherTypeFilter.voucher.hours,
          numberOfUsers: voucherTypeFilter.voucher.numberOfUsers
        } : {})
      },
      _sum: {
        quantity: true
      }
    })

    // Get sales for this month
    const monthSales = await prisma.agentSale.count({
      where: {
        agentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        ...locationFilter,
        ...voucherTypeFilter
      }
    })

    labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
    entitlements.push(Number(monthEntitlements._sum.quantity || 0))
    sales.push(monthSales)
  }

  return { labels, entitlements, sales }
}
