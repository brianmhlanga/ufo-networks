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

    // Get voucher ID from route params
    const voucherId = getRouterParam(event, 'id')

    if (!voucherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Voucher ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { status, notes } = body

    // Validation
    if (!status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status is required'
      })
    }

    // Validate status value
    const validStatuses = ['AVAILABLE', 'RESERVED', 'SOLD', 'REDEEMED', 'EXPIRED', 'DISABLED']
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid status value'
      })
    }

    // Check if voucher exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    })

    if (!existingVoucher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Voucher not found'
      })
    }

    // Check if status change is valid
    if (existingVoucher.status === 'REDEEMED' && status !== 'REDEEMED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot change status of redeemed voucher'
      })
    }

    // Update voucher status
    const updatedVoucher = await prisma.voucher.update({
      where: { id: voucherId },
      data: { status },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        batch: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Log the status change in audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: 'VOUCHER_STATUS_CHANGED',
        entity: 'Voucher',
        entityId: voucherId,
        details: {
          oldStatus: existingVoucher.status,
          newStatus: status,
          notes: notes || null,
          timestamp: new Date().toISOString()
        }
      }
    })

    return {
      success: true,
      message: 'Voucher status updated successfully',
      voucher: updatedVoucher
    }
  } catch (error) {
    console.error('Error updating voucher status:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
