import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and has admin role
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string
    const status = query.status as string
    const performance = query.performance as string
    const sortBy = query.sortBy as string || 'createdAt'
    const sortOrder = query.sortOrder as string || 'desc'

    // Build where clause
    const where: any = {
      role: 'AGENT'
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

    // Add status filter
    if (status) {
      where.status = status
    }

    // Add performance filter
    if (performance) {
      // This would need to be implemented based on agent performance metrics
      // For now, we'll skip this filter
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count
    const total = await prisma.user.count({ where })

    // Get agents with agent profile
    const agents = await prisma.user.findMany({
      where,
      include: {
        agentProfile: true,
        _count: {
          select: {
            agentSales: true,
            agentPurchases: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    })

    // Transform agents to include stats
    const agentsWithStats = agents.map(agent => {
      // Calculate basic stats (in a real app, these would come from actual sales data)
      const totalSales = Math.random() * 10000 // Placeholder
      const totalVouchers = agent._count.agentSales || 0
      const totalCommission = totalSales * 0.1 // 10% commission placeholder

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role,
        status: agent.status || 'ACTIVE',
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
        agentProfile: agent.agentProfile,
        agentStats: {
          totalSales,
          totalVouchers,
          totalCommission
        }
      }
    })

    return {
      agents: agentsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching agents:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
