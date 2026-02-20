import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and has agent role
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = session.user as any
    if (user.role !== 'AGENT') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Agent access required'
      })
    }

    const now = new Date()
    // Get all locations with available vouchers (only non-expired)
    const locations = await prisma.location.findMany({
      where: {
        vouchers: {
          some: {
            status: 'AVAILABLE',
            endDate: { gte: now }
          }
        }
      },
      select: {
        id: true,
        name: true,
        town: true,
        province: true,
        area: true,
        vouchers: {
          where: {
            status: 'AVAILABLE',
            endDate: { gte: now }
          },
          select: {
            hours: true,
            numberOfUsers: true,
            retailPrice: true
          }
        }
      }
    })

    // Process locations to group vouchers by type and calculate agent discounts
    const processedLocations = locations.map(location => {
      // Group vouchers by hours and numberOfUsers
      const voucherGroups = new Map()
      
      location.vouchers.forEach(voucher => {
        const key = `${voucher.hours}-${voucher.numberOfUsers}`
        if (!voucherGroups.has(key)) {
          voucherGroups.set(key, {
            hours: voucher.hours,
            numberOfUsers: voucher.numberOfUsers,
            retailPrice: voucher.retailPrice,
            availableCount: 0,
            agentPrice: 0,
            discountPercentage: 0
          })
        }
        voucherGroups.get(key).availableCount++
      })

      // Calculate agent prices and discounts
      const voucherTypes = Array.from(voucherGroups.values()).map(group => {
        // Default 20% discount for agents (this could be customized per agent)
        const discountPercentage = 20
        const agentPrice = parseFloat(group.retailPrice) * (1 - discountPercentage / 100)
        
        return {
          ...group,
          agentPrice: parseFloat(agentPrice.toFixed(2)),
          discountPercentage,
          quantity: 0 // This will be set by the frontend
        }
      })

      return {
        id: location.id,
        name: location.name,
        town: location.town,
        province: location.province,
        area: location.area,
        voucherTypes
      }
    })

    return {
      success: true,
      data: processedLocations
    }

  } catch (error: any) {
    console.error('Error fetching available vouchers:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
