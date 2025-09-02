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
      where: { id: (session.user as any).id },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required'
      })
    }

    // Generate sample data for testing analytics
    const result = await generateSampleData()

    return {
      success: true,
      message: 'Sample data generated successfully',
      data: result
    }

  } catch (error: any) {
    console.error('Error generating sample data:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate sample data'
    })
  }
})

async function generateSampleData() {
  // Check if we already have some data
  const existingUsers = await prisma.user.count()
  if (existingUsers > 5) {
    return { message: 'Data already exists, skipping generation' }
  }

  // Create sample locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Harare CBD',
        code: 'HAR001',
        town: 'Harare',
        area: 'Central Business District',
        province: 'Harare',
        latitude: -17.8252,
        longitude: 31.0335
      }
    }),
    prisma.location.create({
      data: {
        name: 'Bulawayo Mall',
        code: 'BUL001',
        town: 'Bulawayo',
        area: 'City Centre',
        province: 'Bulawayo',
        latitude: -20.1486,
        longitude: 28.5831
      }
    }),
    prisma.location.create({
      data: {
        name: 'Mutare Airport',
        code: 'MUT001',
        town: 'Mutare',
        area: 'Airport',
        province: 'Manicaland',
        latitude: -18.9975,
        longitude: 32.6274
      }
    })
  ])

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@ufonetworks.com',
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'agent1@ufonetworks.com',
        name: 'John Agent',
        role: 'AGENT',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'customer1@example.com',
        name: 'Jane Customer',
        role: 'CUSTOMER',
        status: 'ACTIVE'
      }
    })
  ])

  // Create agent profiles
  const agentProfile = await prisma.agentProfile.create({
    data: {
      userId: users[1].id,
      displayName: 'John Agent',
      defaultDiscountPct: 10.0,
      cashOnly: true
    }
  })

  // Create voucher batches
  const batches = await Promise.all(
    locations.map(location =>
      prisma.voucherBatch.create({
        data: {
          locationId: location.id,
          name: `${location.name} - 1 Hour`,
          retailPrice: 5.00,
          hours: 1,
          numberOfUsers: 2,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          active: true
        }
      })
    )
  )

  // Create vouchers
  const vouchers = []
  for (const batch of batches) {
    for (let i = 0; i < 50; i++) {
      const voucher = await prisma.voucher.create({
        data: {
          batchId: batch.id,
          locationId: batch.locationId,
          voucherNumber: `UFO-${batch.locationId}-${i + 1}`,
          pin: Math.random().toString(36).substring(2, 8).toUpperCase(),
          retailPrice: batch.retailPrice,
          hours: batch.hours,
          numberOfUsers: batch.numberOfUsers,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          status: Math.random() > 0.7 ? 'AVAILABLE' : 'SOLD'
        }
      })
      vouchers.push(voucher)
    }
  }

  // Create some sold vouchers
  const soldVouchers = vouchers.filter(v => v.status === 'SOLD').slice(0, 20)
  for (const voucher of soldVouchers) {
    if (Math.random() > 0.5) {
      // Create agent sale
      await prisma.agentSale.create({
        data: {
          agentId: agentProfile.id,
          agentPurchaseId: agentProfile.id, // Simplified for sample
          voucherId: voucher.id,
          soldPrice: voucher.retailPrice * 0.9, // 10% discount
          buyerPhone: '+263' + Math.floor(Math.random() * 900000000) + 100000000
        }
      })
    } else {
      // Create order
      const order = await prisma.order.create({
        data: {
          buyerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`,
          buyerPhone: '+263' + Math.floor(Math.random() * 900000000) + 100000000,
          buyerName: `Customer ${Math.floor(Math.random() * 1000)}`,
          subtotal: voucher.retailPrice,
          total: voucher.retailPrice,
          status: 'PAID'
        }
      })

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          locationId: voucher.locationId,
          batchId: voucher.batchId,
          quantity: 1,
          unitPrice: voucher.retailPrice,
          lineTotal: voucher.retailPrice
        }
      })
    }
  }

  // Create some ads
  const ads = await Promise.all([
    prisma.ad.create({
      data: {
        title: 'Premium WiFi Package',
        mediaUrl: 'ad-1234567890.jpg',
        targetUrl: 'https://ufonetworks.com/premium',
        placementPage: 'SUCCESS',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        active: true,
        impressions: Math.floor(Math.random() * 1000),
        clicks: Math.floor(Math.random() * 100)
      }
    }),
    prisma.ad.create({
      data: {
        title: '24/7 Support',
        mediaUrl: 'ad-1234567891.jpg',
        targetUrl: 'https://ufonetworks.com/support',
        placementPage: 'SUCCESS',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        active: true,
        impressions: Math.floor(Math.random() * 800),
        clicks: Math.floor(Math.random() * 80)
      }
    })
  ])

  return {
    locations: locations.length,
    users: users.length,
    batches: batches.length,
    vouchers: vouchers.length,
    ads: ads.length
  }
}
