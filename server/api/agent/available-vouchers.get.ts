import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Voucher stock an agent may buy.
 *
 * An agent is scoped to exactly one location (AgentProfile.locationId) and must only ever see or
 * buy stock for that location — previously this returned every location and the UI summed them
 * into a single "available across all locations" figure.
 */
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

    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, locationId: true, defaultDiscountPct: true }
    })

    if (!agentProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No agent profile found for this account'
      })
    }

    if (!agentProfile.locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No location assigned to your agent account. Contact an administrator.'
      })
    }

    const now = new Date()

    // Only the agent's own location.
    const locations = await prisma.location.findMany({
      where: {
        id: agentProfile.locationId,
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
            dataLimitGb: true,
            retailPrice: true
          }
        }
      }
    })

    // The agent's own discount, not a hardcoded 20%.
    const discountPercentage = Number(agentProfile.defaultDiscountPct) || 0

    const processedLocations = locations.map(location => {
      // Group vouchers by package spec (hours + users + data cap)
      const voucherGroups = new Map()

      location.vouchers.forEach(voucher => {
        const key = `${voucher.hours}-${voucher.numberOfUsers}-${voucher.dataLimitGb ?? 'none'}`
        if (!voucherGroups.has(key)) {
          voucherGroups.set(key, {
            hours: voucher.hours,
            numberOfUsers: voucher.numberOfUsers,
            dataLimitGb: voucher.dataLimitGb,
            retailPrice: voucher.retailPrice,
            availableCount: 0,
            agentPrice: 0,
            discountPercentage: 0
          })
        }
        voucherGroups.get(key).availableCount++
      })

      const voucherTypes = Array.from(voucherGroups.values()).map(group => {
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
      locationId: agentProfile.locationId,
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
