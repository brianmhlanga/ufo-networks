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

    // Validate dates.
    // A one-day grace absorbs the timezone gap between the buyer's browser and this server: a
    // client in UTC+2 sends "today" as local midnight, which serialises to the previous UTC day,
    // and a strict "before today" check would wrongly reject it.
    const DAY_MS = 24 * 60 * 60 * 1000
    const today = new Date()
    today.setHours(0, 0, 0, 0) // start of day, server time
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (startDateObj.getTime() < today.getTime() - DAY_MS) {
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

    // Start date cannot be more than 60 days from today
    const maxStartDate = new Date(today.getTime() + 60 * DAY_MS)

    if (startDateObj.getTime() > maxStartDate.getTime() + DAY_MS) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Start date cannot exceed 60 days from today'
      })
    }

    // End date cannot be more than 60 days from start date
    const maxEndDate = new Date(startDateObj.getTime() + 60 * DAY_MS)

    if (endDateObj.getTime() > maxEndDate.getTime() + DAY_MS) {
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

    // Validate batch numbers format (should be 8-digit numbers), and de-duplicate:
    // voucherNumber and pin are both unique columns, so a number repeated within one PDF
    // would abort the whole insert.
    const invalidBatchNumbers = extractedBatchNumbers.filter(num => !/^\d{8}$/.test(num))
    const validBatchNumbers = Array.from(
      new Set(extractedBatchNumbers.filter(num => /^\d{8}$/.test(num)))
    )

    if (validBatchNumbers.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid batch numbers found. Batch numbers must be 8-digit numbers.'
      })
    }

    // Reject up-front if any of these vouchers already exist, rather than letting the insert
    // fail half-way and strand an empty batch.
    const alreadyExisting = await prisma.voucher.findMany({
      where: { voucherNumber: { in: validBatchNumbers } },
      select: { voucherNumber: true },
      take: 10
    })

    if (alreadyExisting.length > 0) {
      const sample = alreadyExisting.map(v => v.voucherNumber).join(', ')
      throw createError({
        statusCode: 400,
        statusMessage: `These voucher numbers have already been uploaded: ${sample}${alreadyExisting.length === 10 ? ' (and possibly more)' : ''}. This PDF may have been uploaded before.`
      })
    }

    const dataLimitGb = batchData.dataLimitGb ? parseInt(batchData.dataLimitGb) : null
    const adminNotes = (batchData.notes || '').trim()
    const importNote = `Uploaded via PDF. ${validBatchNumbers.length} voucher numbers.${
      invalidBatchNumbers.length ? ` Skipped invalid: ${invalidBatchNumbers.join(', ')}` : ''
    }`

    // Create the batch and its vouchers together: a failure part-way through must not leave
    // an empty batch row behind.
    const batch = await prisma.$transaction(async (tx) => {
      const created = await tx.voucherBatch.create({
        data: {
          name,
          locationId,
          retailPrice: parseFloat(retailPrice),
          hours: parseInt(hours),
          numberOfUsers: parseInt(numberOfUsers),
          dataLimitGb: dataLimitGb && dataLimitGb > 0 ? dataLimitGb : null,
          startDate: startDateObj,
          endDate: endDateObj,
          active: true,
          notes: adminNotes ? `${adminNotes}\n\n${importNote}` : importNote
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

      await tx.voucher.createMany({
        data: validBatchNumbers.map(batchNumber => ({
          voucherNumber: batchNumber,
          pin: batchNumber, // the printed voucher number is the PIN
          batchId: created.id,
          locationId: created.locationId,
          retailPrice: created.retailPrice,
          hours: created.hours,
          numberOfUsers: created.numberOfUsers,
          dataLimitGb: created.dataLimitGb,
          startDate: created.startDate,
          endDate: created.endDate,
          expiryDate: created.endDate,
          status: 'AVAILABLE'
        }))
      })

      return created
    })

    return {
      success: true,
      message: `Batch uploaded successfully with ${validBatchNumbers.length} vouchers`,
      batch,
      extractedData: {
        totalFound: extractedBatchNumbers.length,
        validBatchNumbers,
        invalidBatchNumbers
      }
    }
  } catch (error: any) {
    console.error('Error uploading batch:', error)

    if (error.statusCode) {
      throw error
    }

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'One or more voucher numbers in this PDF already exist in the system.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
