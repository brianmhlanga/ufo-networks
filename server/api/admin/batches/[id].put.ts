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
      description, 
      locationId, 
      quantity, 
      unitCost, 
      status, 
      notes 
    } = body

    // Validation
    if (!name || !locationId || !quantity || !unitCost || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, location, quantity, unit cost, and status are required'
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

    // Validate quantity and cost
    if (quantity <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Quantity must be greater than 0'
      })
    }

    if (unitCost <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unit cost must be greater than 0'
      })
    }

    // Update batch
    const updatedBatch = await prisma.voucherBatch.update({
      where: { id: batchId },
      data: {
        name,
        description: description || '',
        locationId,
        quantity: parseInt(quantity),
        unitCost: parseFloat(unitCost),
        totalCost: parseFloat(unitCost) * parseInt(quantity),
        status,
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
