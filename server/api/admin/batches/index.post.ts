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

    // Get request body
    const body = await readBody(event)
    const { 
      name, 
      description, 
      locationId, 
      retailPrice,
      currency,
      hours,
      numberOfUsers,
      startDate,
      endDate,
      notes 
    } = body

    // Validation
    if (!name || !locationId || !retailPrice || !currency || !hours || !numberOfUsers || !startDate || !endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, location, retail price, currency, hours, number of users, start date, and end date are required'
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

    // Validate retail price
    if (retailPrice <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Retail price must be greater than 0'
      })
    }

    // Validate hours and users
    if (hours <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hours must be greater than 0'
      })
    }

    if (numberOfUsers <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Number of users must be greater than 0'
      })
    }

    // Validate dates
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (startDateObj < today) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Start date cannot be in the past'
      })
    }

    if (endDateObj <= startDateObj) {
      throw createError({
        statusCode: 400,
        statusMessage: 'End date must be after start date'
      })
    }

    // Check maximum validation period (60 days from today)
    
    // Start date cannot be more than 60 days from today
    const maxStartDate = new Date(today)
    maxStartDate.setDate(today.getDate() + 60 - 1)
    
    if (startDateObj > maxStartDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Start date cannot exceed 60 days from today'
      })
    }
    
    // End date cannot be more than 60 days from start date
    const maxEndDate = new Date(startDateObj)
    maxEndDate.setDate(startDateObj.getDate() + 60 - 1)
    
    if (endDateObj > maxEndDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'End date cannot exceed 60 days from start date'
      })
    }

         // Create batch
     const batch = await prisma.voucherBatch.create({
       data: {
         name,
         notes: notes || '',
         locationId,
         retailPrice: parseFloat(retailPrice),
         hours: parseInt(hours),
         numberOfUsers: parseInt(numberOfUsers),
         startDate: startDateObj,
         endDate: endDateObj,
         active: true
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

     // Create a single voucher for manual batch creation
     await prisma.voucher.create({
       data: {
         batchNumber: `MANUAL_${Date.now()}`, // Generate a unique batch number for manual batches
         batchId: batch.id,
         locationId: batch.locationId,
         retailPrice: batch.retailPrice,
         hours: batch.hours,
         numberOfUsers: batch.numberOfUsers,
         startDate: batch.startDate,
         endDate: batch.endDate,
         status: 'AVAILABLE',
         active: true
       }
     })

     // Create a default voucher for the batch (this will be replaced when actual vouchers are generated)
     await prisma.voucher.create({
       data: {
         batchNumber: '00000000', // Placeholder
         batchId: batch.id,
         locationId: batch.locationId,
         retailPrice: batch.retailPrice,
         hours: batch.hours,
         numberOfUsers: batch.numberOfUsers,
         startDate: batch.startDate,
         endDate: batch.endDate,
         status: 'AVAILABLE',
         active: true
       }
     })

    return {
      success: true,
      message: 'Batch created successfully',
      batch
    }
  } catch (error) {
    console.error('Error creating batch:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
