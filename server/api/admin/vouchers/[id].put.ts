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
     const { 
       pin, 
       batchId, 
       locationId, 
       retailPrice, 
       hours, 
       numberOfUsers, 
       status, 
       startDate, 
       endDate, 
       expiryDate 
     } = body

     // Validation
     if (!pin || !locationId || !retailPrice || !hours || !numberOfUsers || !status || !startDate || !endDate || !expiryDate) {
       throw createError({
         statusCode: 400,
         statusMessage: 'All fields are required except batch'
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

     // Generate new voucher number if location changed
     let voucherNumber = existingVoucher.voucherNumber
     if (existingVoucher.locationId !== locationId) {
       const location = await prisma.location.findUnique({
         where: { id: locationId },
         select: { code: true }
       })

       if (!location) {
         throw createError({
           statusCode: 400,
           statusMessage: 'Invalid location ID'
         })
       }

       // Generate new voucher number for the new location
       const lastVoucher = await prisma.voucher.findFirst({
         where: { locationId },
         orderBy: { voucherNumber: 'desc' }
       })

       let nextNumber = 1
       if (lastVoucher) {
         const lastNumberMatch = lastVoucher.voucherNumber.match(/\d+$/)
         if (lastNumberMatch) {
           nextNumber = parseInt(lastNumberMatch[0]) + 1
         }
       }

       voucherNumber = `UFO-${location.code}-${nextNumber.toString().padStart(4, '0')}`
     }

    // Check if PIN already exists (excluding current voucher)
    const existingPin = await prisma.voucher.findUnique({
      where: { 
        pin,
        NOT: { id: voucherId }
      }
    })

    if (existingPin) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PIN already exists'
      })
    }

         // Validate batch exists only if provided
     if (batchId) {
       const batch = await prisma.voucherBatch.findUnique({
         where: { id: batchId }
       })

       if (!batch) {
         throw createError({
           statusCode: 400,
           statusMessage: 'Invalid batch ID'
         })
       }
     }

              // Update voucher
     const updatedVoucher = await prisma.voucher.update({
       where: { id: voucherId },
       data: {
         voucherNumber,
         pin,
         batchId: batchId || null,
         locationId,
         retailPrice: parseFloat(retailPrice),
         hours: parseInt(hours),
         numberOfUsers: parseInt(numberOfUsers),
         status,
         startDate: new Date(startDate),
         endDate: new Date(endDate),
         expiryDate: new Date(expiryDate)
       }
     })

    return {
      success: true,
      message: 'Voucher updated successfully',
      voucher: updatedVoucher
    }
  } catch (error) {
    console.error('Error updating voucher:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
