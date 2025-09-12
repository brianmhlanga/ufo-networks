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

    // Get agent purchases (entitlements)
    const agentPurchases = await prisma.agentPurchase.findMany({
      where: { agentId: agentProfile.id },
      include: {
        location: true,
        batch: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Process entitlements by voucher type (hours and numberOfUsers)
    const entitlementsMap = new Map()
    
    agentPurchases.forEach(purchase => {
      // Use the new hours and numberOfUsers fields from AgentPurchase
      const key = `${purchase.hours}-${purchase.numberOfUsers}`
      
      if (!entitlementsMap.has(key)) {
        entitlementsMap.set(key, {
          id: key,
          hours: purchase.hours,
          numberOfUsers: purchase.numberOfUsers,
          totalQuantity: 0,
          availableQuantity: 0,
          soldQuantity: 0,
          purchaseDate: purchase.createdAt,
          locationName: purchase.location?.name || 'All Locations',
          batchName: purchase.batch?.name || 'Generic',
          locationId: purchase.location?.id || null,
          batchId: purchase.batch?.id || null
        })
      }
      
      const entitlement = entitlementsMap.get(key)
      entitlement.totalQuantity += purchase.quantity
      entitlement.availableQuantity += purchase.quantity
    })

    // No need to determine voucher types from vouchers anymore since we have them in AgentPurchase

    // Get recent sales to calculate sold quantities
    const recentSales = await prisma.agentSale.findMany({
      where: { agentId: agentProfile.id },
      include: {
        voucher: true,
        agentPurchase: {
          include: {
            batch: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Calculate sold quantities and update available quantities
    recentSales.forEach(sale => {
      // Use the hours and numberOfUsers from the agent purchase
      const key = `${sale.agentPurchase.hours}-${sale.agentPurchase.numberOfUsers}`
      
      if (entitlementsMap.has(key)) {
        const entitlement = entitlementsMap.get(key)
        entitlement.soldQuantity += 1 // Each sale is 1 voucher
        entitlement.availableQuantity = Math.max(0, entitlement.totalQuantity - entitlement.soldQuantity)
      }
    })

    // Calculate statistics
    const totalEntitlements = Array.from(entitlementsMap.values()).reduce((sum, e) => sum + e.totalQuantity, 0)
    const availableForSale = Array.from(entitlementsMap.values()).reduce((sum, e) => sum + e.availableQuantity, 0)
    
    // Get sales for today and this month
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const soldToday = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        createdAt: { gte: today }
      }
    })

    const soldThisMonth = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        createdAt: { gte: thisMonth }
      }
    })

    // Format recent sales for display
    const formattedRecentSales = recentSales.map(sale => ({
      id: sale.id,
      hours: sale.voucher.hours,
      numberOfUsers: sale.voucher.numberOfUsers,
      quantity: 1, // Each sale is 1 voucher
      totalAmount: sale.soldPrice,
      customerName: sale.buyerNote || 'Anonymous',
      customerPhone: sale.buyerPhone || 'N/A',
      saleDate: sale.createdAt
    }))

    return {
      success: true,
      entitlements: Array.from(entitlementsMap.values()),
      recentSales: formattedRecentSales,
      stats: {
        totalEntitlements,
        availableForSale,
        soldToday,
        soldThisMonth
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent entitlements:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
