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
    const { dateRange, voucherType, locationId, search } = query

    // Build where clause for sales
    let whereClause: any = {
      agentId: agentProfile.id
    }

    // Add voucher type filter
    if (voucherType && voucherType !== 'all') {
      const [hours, numberOfUsers] = String(voucherType).split('-').map(Number)
      whereClause.voucher = {
        hours: hours,
        numberOfUsers: numberOfUsers
      }
    }

    // Add location filter
    if (locationId && locationId !== 'all') {
      whereClause.voucher = {
        ...whereClause.voucher,
        locationId: String(locationId)
      }
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { buyerNote: { contains: String(search), mode: 'insensitive' } },
        { buyerPhone: { contains: String(search), mode: 'insensitive' } }
      ]
    }

    // Add date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          const dayOfWeek = now.getDay()
          const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
          startDate = new Date(now.getFullYear(), now.getMonth(), diff)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }

      whereClause.createdAt = {
        gte: startDate
      }
    }

    // Get sales with related data
    const sales = await prisma.agentSale.findMany({
      where: whereClause,
      include: {
        voucher: {
          include: {
            location: true
          }
        },
        agentPurchase: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.soldPrice), 0)
    const averageSalePrice = totalSales > 0 ? totalRevenue / totalSales : 0

    // Calculate total profit/loss
    const totalProfitLoss = sales.reduce((sum, sale) => {
      const sellingPrice = Number(sale.soldPrice)
      const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
      return sum + (sellingPrice - buyingPrice)
    }, 0)

    // Calculate this month's sales
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const thisMonthSales = sales.filter(sale => 
      new Date(sale.createdAt) >= thisMonthStart
    ).length

    // Get voucher types for filter options
    const voucherTypes = await prisma.agentSale.findMany({
      where: { agentId: agentProfile.id },
      select: {
        voucher: {
          select: {
            hours: true,
            numberOfUsers: true
          }
        }
      },
      distinct: ['voucherId']
    })

    const uniqueVoucherTypes = voucherTypes.map(sale => ({
      hours: sale.voucher.hours,
      numberOfUsers: sale.voucher.numberOfUsers
    }))

    return {
      success: true,
      data: {
        sales,
        stats: {
          totalSales,
          totalRevenue,
          thisMonthSales,
          averageSalePrice,
          totalProfitLoss
        },
        voucherTypes: uniqueVoucherTypes
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent sales:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
