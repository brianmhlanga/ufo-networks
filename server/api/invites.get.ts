import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const userEmail = (session.user as any).email

    // Get all pending invites for this user's email
    const invites = await prisma.companyInvite.findMany({
      where: {
        email: userEmail,
        status: 'PENDING',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true
          }
        },
        invitedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      invites
    }
  } catch (error: any) {
    console.error('Error fetching user invites:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch invites'
    })
  }
}) 