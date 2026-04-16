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

    // Get batch ID from route params
    const batchId = getRouterParam(event, 'id')

    if (!batchId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Batch ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const {
      name,
      locationId,
      retailPrice,
      hours,
      numberOfUsers,
      startDate,
      endDate,
      active,
      notes
    } = body

    // Validation
    if (!name || !locationId || !retailPrice || !hours || !numberOfUsers || !startDate || !endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, location, retail price, hours, number of users, start date, and end date are required'
      })
    }

    // Check if batch exists
    const existingBatch = await prisma.voucherBatch.findUnique({
      where: { id: batchId }
    })

    if (!existingBatch) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found'
      })
    }

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    })

    if (!location) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid location ID'
      })
    }

    // Validate numeric values
    if (Number(retailPrice) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Retail price must be greater than 0'
      })
    }

    if (Number(hours) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hours must be greater than 0'
      })
    }

    if (Number(numberOfUsers) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Number of users must be greater than 0'
      })
    }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (Number.isNaN(startDateObj.getTime()) || Number.isNaN(endDateObj.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid start or end date'
      })
    }

    if (endDateObj <= startDateObj) {
      throw createError({
        statusCode: 400,
        statusMessage: 'End date must be after start date'
      })
    }

    // Update batch
    const updatedBatch = await prisma.voucherBatch.update({
      where: { id: batchId },
      data: {
        name,
        locationId,
        retailPrice: parseFloat(retailPrice),
        hours: parseInt(hours),
        numberOfUsers: parseInt(numberOfUsers),
        startDate: startDateObj,
        endDate: endDateObj,
        active: typeof active === 'boolean' ? active : existingBatch.active,
        notes: notes || ''
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Batch updated successfully',
      batch: updatedBatch
    }
  } catch (error) {
    console.error('Error updating batch:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
