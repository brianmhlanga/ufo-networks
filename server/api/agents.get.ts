import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const search = query.search as string
    const province = query.province as string
    const status = query.status as string || 'ACTIVE'

    // Build where clause
    const where: any = {
      role: 'AGENT',
      status: status
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { agentProfile: { displayName: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Get agents with their profiles and locations
    const agents = await prisma.user.findMany({
      where,
      include: {
        agentProfile: {
          include: {
            location: true,
            _count: {
              select: {
                sales: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get all locations for mapping
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        town: true,
        province: true,
        code: true
      }
    })

    // Transform agents to include location info and stats
    const agentsWithLocations = agents.map(agent => {
      // Get agent's primary location from the agentProfile
      const agentLocations = agent.agentProfile?.location ? [agent.agentProfile.location] : []

      // Calculate basic stats
      const totalVouchers = agent.agentProfile?._count?.sales || 0
      const totalSales = totalVouchers * 50 // Placeholder calculation
      const totalCommission = totalSales * 0.1 // 10% commission

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        status: agent.status || 'ACTIVE',
        createdAt: agent.createdAt,
        agentProfile: {
          displayName: agent.agentProfile?.displayName || agent.name,
          defaultDiscountPct: agent.agentProfile?.defaultDiscountPct || 0,
          cashOnly: agent.agentProfile?.cashOnly || false,
          location: agent.agentProfile?.location ? {
            id: agent.agentProfile.location.id,
            name: agent.agentProfile.location.name,
            town: agent.agentProfile.location.town,
            province: agent.agentProfile.location.province,
            code: agent.agentProfile.location.code
          } : null
        },
        locations: agentLocations,
        stats: {
          totalSales,
          totalVouchers,
          totalCommission,
          rating: 4.5 + Math.random() * 0.5 // Placeholder rating
        }
      }
    })

    // Filter by province if specified
    let filteredAgents = agentsWithLocations
    if (province) {
      filteredAgents = agentsWithLocations.filter(agent => 
        agent.agentProfile.location?.province === province ||
        agent.locations.some(loc => loc.province === province)
      )
    }

    return {
      success: true,
      data: filteredAgents,
      total: filteredAgents.length
    }

  } catch (error) {
    console.error('Error fetching agents:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
