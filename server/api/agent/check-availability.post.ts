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

    // Get request body
    const body = await readBody(event)
    const { locationId, hours, numberOfUsers } = body

    // Validate required fields
    if (!locationId || !hours || !numberOfUsers) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: locationId, hours, numberOfUsers'
      })
    }

    // Check vouchers in stock at the specific location
    const vouchersInStock = await prisma.voucher.count({
      where: {
        locationId: locationId,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers),
        status: 'AVAILABLE',
        endDate: { gte: new Date() } // Not expired
      }
    })

    // Check agent entitlements for this voucher type
    const agentEntitlements = await prisma.agentPurchase.aggregate({
      where: {
        agentId: agentProfile.id,
        hours: Number(hours),
        numberOfUsers: Number(numberOfUsers)
      },
      _sum: {
        quantity: true
      }
    })

    const totalEntitlements = agentEntitlements._sum.quantity || 0

    // Count already sold vouchers of this type by this agent
    const alreadySold = await prisma.agentSale.count({
      where: {
        agentId: agentProfile.id,
        agentPurchase: {
          hours: Number(hours),
          numberOfUsers: Number(numberOfUsers)
        }
      }
    })

    // Calculate available for sale (minimum of vouchers in stock and agent entitlements)
    const availableForSale = Math.min(vouchersInStock, totalEntitlements - alreadySold)

    return {
      success: true,
      data: {
        vouchersInStock,
        agentEntitlements: totalEntitlements,
        alreadySold,
        availableForSale: Math.max(0, availableForSale)
      }
    }

  } catch (error: any) {
    console.error('Error checking availability:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
