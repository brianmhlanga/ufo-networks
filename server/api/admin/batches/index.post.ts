import { PrismaClient } from '@prisma/client'
import { getAuditActor, serializeForAudit, writeAuditLog } from '~/server/utils/auditLog'

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
      dataLimitGb,
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

    // Create batch. No vouchers are created here — real voucher numbers only ever come from the
    // PDF upload (/api/admin/batches/upload), which is the router's own export.
    const batch = await prisma.voucherBatch.create({
      data: {
        name,
        notes: notes || '',
        locationId,
        retailPrice: parseFloat(retailPrice),
        hours: parseInt(hours),
        numberOfUsers: parseInt(numberOfUsers),
        dataLimitGb: dataLimitGb && parseInt(dataLimitGb) > 0 ? parseInt(dataLimitGb) : null,
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

    const audit = await getAuditActor(event)
    await writeAuditLog(prisma, {
      ...audit,
      action: 'VOUCHER_BATCH_CREATED',
      entity: 'VoucherBatch',
      entityId: batch.id,
      details: { snapshot: serializeForAudit(batch) },
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
