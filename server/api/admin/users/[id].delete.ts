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

    // Get user ID from params
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        agentProfile: true,
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

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Check if user has associated data
    const hasAssociatedData = 
      existingUser._count.orders > 0 ||
      existingUser._count.reviews > 0 ||
      existingUser._count.comments > 0 ||
      existingUser._count.agentPurchases > 0 ||
      existingUser._count.agentSales > 0

    if (hasAssociatedData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete user with associated data (orders, reviews, comments, agent transactions). Please archive the user instead.'
      })
    }

    // Prevent deleting self
    if (userId === session.user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Delete user (this will cascade delete agent profile if exists)
    await prisma.user.delete({
      where: { id: userId }
    })

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
