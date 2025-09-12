import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get all locations
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        town: true,
        area: true,
        province: true,
        code: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: locations
    }

  } catch (error: any) {
    console.error('Error fetching locations:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
