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

    // Get unique voucher types from agent's sales
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

    // Format the response
    const uniqueVoucherTypes = voucherTypes.map(sale => ({
      hours: sale.voucher.hours,
      numberOfUsers: sale.voucher.numberOfUsers
    }))

    return {
      success: true,
      data: uniqueVoucherTypes
    }

  } catch (error: any) {
    console.error('Error fetching agent voucher types:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
