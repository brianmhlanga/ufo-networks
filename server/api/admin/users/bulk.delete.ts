import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check admin authentication
    const session = await getServerSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User IDs array is required'
      })
    }

    // Prevent deleting self
    if (ids.includes(session.user.id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Check if users exist and have associated data
    const usersToDelete = await prisma.user.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
            comments: true,
            agentPurchases: true,
            agentSales: true
          }
        }
      }
    })

    if (usersToDelete.length !== ids.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Some users not found'
      })
    }

    // Check for users with associated data
    const usersWithData = usersToDelete.filter(user => 
      user._count.orders > 0 ||
      user._count.reviews > 0 ||
      user._count.comments > 0 ||
      user._count.agentPurchases > 0 ||
      user._count.agentSales > 0
    )

    if (usersWithData.length > 0) {
      const userNames = usersWithData.map(u => u.name || u.email).join(', ')
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete users with associated data: ${userNames}. Please archive these users instead.`
      })
    }

    // Delete users
    await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return {
      success: true,
      message: `${ids.length} user(s) deleted successfully`
    }
  } catch (error: any) {
    console.error('Error bulk deleting users:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
