import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check if user is admin
    const session = await getUserSession(event)
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin access required'
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
        agentProfile: {
          include: {
            _count: {
              select: {
                sales: true
              }
            }
          }
        },
        _count: {
          select: {
            orders: true,
            auditLogs: true,
            assignedVouchers: true
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
      existingUser._count.auditLogs > 0 ||
      existingUser._count.assignedVouchers > 0 ||
      (existingUser.agentProfile?._count?.sales || 0) > 0

    if (hasAssociatedData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete user with associated data (orders, audit logs, assigned vouchers, agent transactions). Please archive the user instead.'
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
