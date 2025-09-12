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

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Get business statistics
    const totalEntitlements = await prisma.agentPurchase.aggregate({
      where: { agentId: agentProfile.id },
      _sum: { quantity: true }
    })

    const claimedEntitlements = await prisma.agentPurchase.aggregate({
      where: { agentId: agentProfile.id },
      _sum: { claimedCount: true }
    })

    const totalSales = await prisma.agentSale.count({
      where: { agentId: agentProfile.id }
    })

    const revenueResult = await prisma.agentSale.aggregate({
      where: { agentId: agentProfile.id },
      _sum: { soldPrice: true }
    })

    const totalRevenue = Number(revenueResult._sum.soldPrice || 0)

    // Calculate total profit
    const salesWithCosts = await prisma.agentSale.findMany({
      where: { agentId: agentProfile.id },
      include: {
        agentPurchase: {
          select: { unitCost: true }
        }
      }
    })

    const totalProfit = salesWithCosts.reduce((sum, sale) => {
      const sellingPrice = Number(sale.soldPrice)
      const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
      return sum + (sellingPrice - buyingPrice)
    }, 0)

    const stats = {
      totalEntitlements: Number(totalEntitlements._sum.quantity || 0),
      availableEntitlements: Number(totalEntitlements._sum.quantity || 0) - Number(claimedEntitlements._sum.claimedCount || 0),
      totalSales,
      totalRevenue,
      totalProfit
    }

    return {
      success: true,
      data: {
        user,
        agentProfile,
        stats
      }
    }

  } catch (error: any) {
    console.error('Error fetching agent profile:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
