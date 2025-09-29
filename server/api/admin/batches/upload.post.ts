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

    // Get form data
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Form data is required'
      })
    }

    // Extract form fields
    const batchData: any = {}
    let pdfFile: any = null

    for (const field of formData) {
      if (field.name === 'pdfFile' && field.filename) {
        pdfFile = field
      } else if (field.name && field.data) {
        batchData[field.name] = field.data.toString()
      }
    }

    // Validate required fields
    const { 
      name, 
      locationId, 
      retailPrice, 
      currency, 
      hours, 
      numberOfUsers, 
      startDate, 
      endDate 
    } = batchData

    if (!name || !locationId || !retailPrice || !currency || !hours || !numberOfUsers || !startDate || !endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All batch fields are required'
      })
    }

    // PDF file is optional now since we extract numbers on client side
    // But we can still store it for reference if needed

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
    if (parseFloat(retailPrice) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Retail price must be greater than 0'
      })
    }

    // Validate hours and users
    if (parseInt(hours) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hours must be greater than 0'
      })
    }

    if (parseInt(numberOfUsers) <= 0) {
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

    // Expect batch numbers to be extracted on client side and sent with the request
    let extractedBatchNumbers: string[] = []
    
    if (batchData.extractedBatchNumbers) {
      try {
        extractedBatchNumbers = JSON.parse(batchData.extractedBatchNumbers)
      } catch (error) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid batch numbers format'
        })
      }
    }
    
    if (!extractedBatchNumbers || !Array.isArray(extractedBatchNumbers) || extractedBatchNumbers.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No batch numbers provided. Please extract batch numbers from PDF on client side.'
      })
    }

    // Validate batch numbers format (should be 8-digit numbers)
    const validBatchNumbers = extractedBatchNumbers.filter(num => /^\d{8}$/.test(num))
    const invalidBatchNumbers = extractedBatchNumbers.filter(num => !/^\d{8}$/.test(num))

    if (validBatchNumbers.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid batch numbers found. Batch numbers must be 8-digit numbers.'
      })
    }

         // Create batch
     const batch = await prisma.voucherBatch.create({
       data: {
         name,
         locationId,
         retailPrice: parseFloat(retailPrice),
         hours: parseInt(hours),
         numberOfUsers: parseInt(numberOfUsers),
         startDate: startDateObj,
         endDate: endDateObj,
         active: true,
         notes: `Uploaded via PDF upload. Found ${validBatchNumbers.length} valid batch numbers. Invalid: ${invalidBatchNumbers.join(', ')}`
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

     // Create vouchers for each batch number
     const voucherData = validBatchNumbers.map(batchNumber => ({
       voucherNumber: batchNumber,
       pin: batchNumber, // Using batch number as PIN for now
       batchId: batch.id,
       locationId: batch.locationId,
       retailPrice: batch.retailPrice,
       hours: batch.hours,
       numberOfUsers: batch.numberOfUsers,
       startDate: batch.startDate,
       endDate: batch.endDate,
       expiryDate: batch.endDate, // Set expiry date same as end date
       status: 'AVAILABLE'
     }))

     await prisma.voucher.createMany({
       data: voucherData
     })

    return {
      success: true,
      message: 'Batch uploaded successfully',
      batch,
      extractedData: {
        totalFound: extractedBatchNumbers.length,
        validBatchNumbers,
        invalidBatchNumbers
      }
    }
  } catch (error) {
    console.error('Error uploading batch:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
