import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const body = await readBody(event)
    const { locationId, hours, numberOfUsers, quantity, unitCost, totalCost } = body

    // Validate required fields
    if (!hours || !numberOfUsers || !quantity || !unitCost || !totalCost) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Get the current user from session
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = session.user as any
    const userId = user.id

    // Verify user is an agent
    if (user.role !== 'AGENT') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only agents can purchase vouchers'
      })
    }

    // Get the agent profile for this user
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: userId }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Agent profile not found. Please contact support.'
      })
    }

    // Check if there are enough available vouchers across all locations
    const availableVouchers = await prisma.voucher.count({
      where: {
        hours,
        numberOfUsers,
        status: 'AVAILABLE'
      }
    })

    if (availableVouchers < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Only ${availableVouchers} vouchers available, requested ${quantity}`
      })
    }

    // Create the agent purchase record
    const agentPurchase = await prisma.agentPurchase.create({
      data: {
        agentId: agentProfile.id,
        locationId: locationId || null,
        quantity,
        unitCost: parseFloat(unitCost),
        totalCost: parseFloat(totalCost),
        claimedCount: 0, // No vouchers claimed yet
        notes: `Purchase of ${quantity} ${hours}H ${numberOfUsers}U vouchers`
      }
    })

    return {
      success: true,
      message: 'Voucher entitlements purchased successfully',
      data: {
        id: agentPurchase.id,
        quantity: agentPurchase.quantity,
        totalCost: agentPurchase.totalCost
      }
    }

  } catch (error: any) {
    console.error('Agent purchase error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
