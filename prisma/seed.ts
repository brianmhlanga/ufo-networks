import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Clearing existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.adLocationLink.deleteMany()
  await prisma.ad.deleteMany()
  await prisma.adSubscription.deleteMany()
  await prisma.advertiser.deleteMany()
  await prisma.adPackage.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.agentSale.deleteMany()
  await prisma.agentPurchase.deleteMany()
  await prisma.agentVoucherDiscount.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.voucherBatch.deleteMany()
  await prisma.location.deleteMany()
  await prisma.agentProfile.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database cleared')

  // Create Users
  console.log('👥 Creating users...')
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@ufonetworks.com',
      phone: '+263771234567',
      passwordHash: await hash('admin123', 12),
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  })

  const admin = await prisma.user.create({
    data: {
      email: 'manager@ufonetworks.com',
      phone: '+263772345678',
      passwordHash: await hash('manager123', 12),
      name: 'System Manager',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  const agent1 = await prisma.user.create({
    data: {
      email: 'agent1@ufonetworks.com',
      phone: '+263773456789',
      passwordHash: await hash('agent123', 12),
      name: 'John Agent',
      role: 'AGENT',
      status: 'ACTIVE'
    }
  })

  const agent2 = await prisma.user.create({
    data: {
      email: 'agent2@ufonetworks.com',
      phone: '+263774567890',
      passwordHash: await hash('agent123', 12),
      name: 'Sarah Agent',
      role: 'AGENT',
      status: 'ACTIVE'
    }
  })

  const agent3 = await prisma.user.create({
    data: {
      email: 'agent3@ufonetworks.com',
      phone: '+263774567891',
      passwordHash: await hash('agent123', 12),
      name: 'Mike Blacklisted',
      role: 'AGENT',
      status: 'BLACKLISTED'
    }
  })

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      phone: '+263775678901',
      passwordHash: await hash('customer123', 12),
      name: 'Alice Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    }
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      phone: '+263776789012',
      passwordHash: await hash('customer123', 12),
      name: 'Bob Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    }
  })

  console.log('✅ Users created')

  // Create Agent Profiles
  console.log('🏪 Creating agent profiles...')
  
  const agentProfile1 = await prisma.agentProfile.create({
    data: {
      userId: agent1.id,
      displayName: 'John\'s WiFi Shop',
      defaultDiscountPct: 10.0,
      cashOnly: true
    }
  })

  const agentProfile2 = await prisma.agentProfile.create({
    data: {
      userId: agent2.id,
      displayName: 'Sarah\'s Internet Hub',
      defaultDiscountPct: 15.0,
      cashOnly: false
    }
  })

  console.log('✅ Agent profiles created')

  // Create Locations
  console.log('📍 Creating locations...')
  
  const harareCentral = await prisma.location.create({
    data: {
      name: 'Harare Central Business District',
      code: 'HARARE_CBD',
      town: 'Harare',
      area: 'Central Business District',
      province: 'Harare',
      meta: {
        routerModel: 'MikroTik RB951G-2HnD',
        ssid: 'UFO_HARARE_CBD',
        coordinates: { lat: -17.8252, lng: 31.0335 }
      }
    }
  })

  const bulawayoCentral = await prisma.location.create({
    data: {
      name: 'Bulawayo Central',
      code: 'BULAWAYO_CBD',
      town: 'Bulawayo',
      area: 'Central Business District',
      province: 'Bulawayo',
      meta: {
        routerModel: 'MikroTik RB951G-2HnD',
        ssid: 'UFO_BULAWAYO_CBD',
        coordinates: { lat: -20.1325, lng: 28.6265 }
      }
    }
  })

  const chitungwiza = await prisma.location.create({
    data: {
      name: 'Chitungwiza Town Centre',
      code: 'CHITUNGWIZA_TC',
      town: 'Chitungwiza',
      area: 'Town Centre',
      province: 'Harare',
      meta: {
        routerModel: 'MikroTik RB951G-2HnD',
        ssid: 'UFO_CHITUNGWIZA_TC',
        coordinates: { lat: -18.0128, lng: 31.0756 }
      }
    }
  })

  const mutare = await prisma.location.create({
    data: {
      name: 'Mutare City Centre',
      code: 'MUTARE_CC',
      town: 'Mutare',
      area: 'City Centre',
      province: 'Manicaland',
      meta: {
        routerModel: 'MikroTik RB951G-2HnD',
        ssid: 'UFO_MUTARE_CC',
        coordinates: { lat: -18.9726, lng: 32.6709 }
      }
    }
  })

  console.log('✅ Locations created')

  // Create Voucher Batches
  console.log('🎫 Creating voucher batches...')
  
  const batch1Hour = await prisma.voucherBatch.create({
    data: {
      locationId: harareCentral.id,
      name: '1 Hour WiFi - Harare CBD',
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      notes: 'Standard 1-hour WiFi access'
    }
  })

  const batch5Hours = await prisma.voucherBatch.create({
    data: {
      locationId: harareCentral.id,
      name: '5 Hours WiFi - Harare CBD',
      retailPrice: 10.00,
      hours: 5,
      numberOfUsers: 2,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      notes: 'Extended 5-hour WiFi access'
    }
  })

  const batch24Hours = await prisma.voucherBatch.create({
    data: {
      locationId: harareCentral.id,
      name: '24 Hours WiFi - Harare CBD',
      retailPrice: 25.00,
      hours: 24,
      numberOfUsers: 3,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      notes: 'Full day WiFi access'
    }
  })

  const batchBulawayo1Hour = await prisma.voucherBatch.create({
    data: {
      locationId: bulawayoCentral.id,
      name: '1 Hour WiFi - Bulawayo CBD',
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      notes: 'Standard 1-hour WiFi access'
    }
  })

  console.log('✅ Voucher batches created')

  // Create Vouchers
  console.log('🎫 Creating vouchers...')
  
  const vouchers = []
  
  // Generate 50 vouchers for Harare CBD
  for (let i = 1; i <= 20; i++) {
    vouchers.push({
      batchId: batch1Hour.id,
      locationId: harareCentral.id,
      voucherNumber: `HARARE-1H-${i.toString().padStart(3, '0')}`,
      pin: Math.random().toString(36).substring(2, 8).toUpperCase(),
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'AVAILABLE'
    })
  }

  for (let i = 1; i <= 15; i++) {
    vouchers.push({
      batchId: batch5Hours.id,
      locationId: harareCentral.id,
      voucherNumber: `HARARE-5H-${i.toString().padStart(3, '0')}`,
      pin: Math.random().toString(36).substring(2, 8).toUpperCase(),
      retailPrice: 10.00,
      hours: 5,
      numberOfUsers: 2,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'AVAILABLE'
    })
  }

  for (let i = 1; i <= 10; i++) {
    vouchers.push({
      batchId: batch24Hours.id,
      locationId: harareCentral.id,
      voucherNumber: `HARARE-24H-${i.toString().padStart(3, '0')}`,
      pin: Math.random().toString(36).substring(2, 8).toUpperCase(),
      retailPrice: 25.00,
      hours: 24,
      numberOfUsers: 3,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'AVAILABLE'
    })
  }

  // Generate 20 vouchers for Bulawayo CBD
  for (let i = 1; i <= 20; i++) {
    vouchers.push({
      batchId: batchBulawayo1Hour.id,
      locationId: bulawayoCentral.id,
      voucherNumber: `BULAWAYO-1H-${i.toString().padStart(3, '0')}`,
      pin: Math.random().toString(36).substring(2, 8).toUpperCase(),
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'AVAILABLE'
    })
  }

  // Create some sold vouchers
  const soldVouchers = [
    {
      batchId: batch1Hour.id,
      locationId: harareCentral.id,
      voucherNumber: 'HARARE-1H-SOLD-001',
      pin: 'SOLD01',
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'SOLD',
      soldAt: new Date('2024-01-15'),
      assignedToUserId: customer1.id
    },
    {
      batchId: batch5Hours.id,
      locationId: harareCentral.id,
      voucherNumber: 'HARARE-5H-SOLD-001',
      pin: 'SOLD02',
      retailPrice: 10.00,
      hours: 5,
      numberOfUsers: 2,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      expiryDate: new Date('2024-12-31'),
      status: 'REDEEMED',
      soldAt: new Date('2024-01-10'),
      assignedToUserId: customer2.id,
      redeemedAt: new Date('2024-01-12')
    }
  ]

  await prisma.voucher.createMany({
    data: [...vouchers, ...soldVouchers]
  })

  console.log('✅ Vouchers created')

  // Create Agent Purchases
  console.log('🛒 Creating agent purchases...')
  
  const agentPurchase1 = await prisma.agentPurchase.create({
    data: {
      agentId: agentProfile1.id,
      locationId: harareCentral.id,
      quantity: 50,
      unitCost: 2.00,
      totalCost: 100.00,
      claimedCount: 5,
      notes: 'Bulk purchase for Harare CBD location'
    }
  })

  const agentPurchase2 = await prisma.agentPurchase.create({
    data: {
      agentId: agentProfile2.id,
      locationId: bulawayoCentral.id,
      quantity: 30,
      unitCost: 2.00,
      totalCost: 60.00,
      claimedCount: 2,
      notes: 'Bulk purchase for Bulawayo CBD location'
    }
  })

  console.log('✅ Agent purchases created')

  // Create Agent Sales
  console.log('💰 Creating agent sales...')
  
  // Get some vouchers to sell
  const availableVouchers = await prisma.voucher.findMany({
    where: { status: 'AVAILABLE' },
    take: 7
  })

  if (availableVouchers.length >= 7) {
    await prisma.agentSale.createMany({
      data: [
        {
          agentId: agentProfile1.id,
          agentPurchaseId: agentPurchase1.id,
          voucherId: availableVouchers[0].id,
          soldPrice: 2.50,
          buyerPhone: '+263777123456',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile1.id,
          agentPurchaseId: agentPurchase1.id,
          voucherId: availableVouchers[1].id,
          soldPrice: 2.50,
          buyerPhone: '+263777234567',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile1.id,
          agentPurchaseId: agentPurchase1.id,
          voucherId: availableVouchers[2].id,
          soldPrice: 2.50,
          buyerPhone: '+263777345678',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile1.id,
          agentPurchaseId: agentPurchase1.id,
          voucherId: availableVouchers[3].id,
          soldPrice: 2.50,
          buyerPhone: '+263777456789',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile1.id,
          agentPurchaseId: agentPurchase1.id,
          voucherId: availableVouchers[4].id,
          soldPrice: 2.50,
          buyerPhone: '+263777567890',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile2.id,
          agentPurchaseId: agentPurchase2.id,
          voucherId: availableVouchers[5].id,
          soldPrice: 2.50,
          buyerPhone: '+263777678901',
          buyerNote: 'Cash sale'
        },
        {
          agentId: agentProfile2.id,
          agentPurchaseId: agentPurchase2.id,
          voucherId: availableVouchers[6].id,
          soldPrice: 2.50,
          buyerPhone: '+263777789012',
          buyerNote: 'Cash sale'
        }
      ]
    })

    // Update voucher status to SOLD
    await prisma.voucher.updateMany({
      where: {
        id: {
          in: availableVouchers.slice(0, 7).map(v => v.id)
        }
      },
      data: {
        status: 'SOLD',
        soldAt: new Date(),
        assignedToAgentId: agentProfile1.id
      }
    })
  }

  console.log('✅ Agent sales created')

  // Create Agent Voucher Discounts
  console.log('🎯 Creating agent voucher discounts...')
  
  await prisma.agentVoucherDiscount.createMany({
    data: [
      {
        agentId: agentProfile1.id,
        locationId: harareCentral.id,
        voucherType: '1hour',
        discountPercentage: 10.0,
        minQuantity: 10,
        maxQuantity: 100,
        active: true,
        notes: '10% discount for bulk 1-hour vouchers'
      },
      {
        agentId: agentProfile2.id,
        locationId: bulawayoCentral.id,
        voucherType: '1hour',
        discountPercentage: 15.0,
        minQuantity: 5,
        maxQuantity: 50,
        active: true,
        notes: '15% discount for bulk 1-hour vouchers'
      }
    ]
  })

  console.log('✅ Agent voucher discounts created')

  // Create Orders
  console.log('🛍️ Creating orders...')
  
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      buyerEmail: 'customer1@example.com',
      buyerPhone: '+263775678901',
      buyerName: 'Alice Customer',
      currency: 'USD',
      subtotal: 5.00,
      discountTotal: 0.00,
      total: 5.00,
      status: 'PAID'
    }
  })

  const order2 = await prisma.order.create({
    data: {
      buyerEmail: 'anonymous@example.com',
      buyerPhone: '+263776789012',
      buyerName: 'Anonymous Customer',
      currency: 'USD',
      subtotal: 10.00,
      discountTotal: 0.00,
      total: 10.00,
      status: 'PENDING'
    }
  })

  console.log('✅ Orders created')

  // Create Order Items
  console.log('📦 Creating order items...')
  
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        locationId: harareCentral.id,
        batchId: batch1Hour.id,
        quantity: 2,
        unitPrice: 2.50,
        lineTotal: 5.00
      },
      {
        orderId: order2.id,
        locationId: harareCentral.id,
        batchId: batch5Hours.id,
        quantity: 1,
        unitPrice: 10.00,
        lineTotal: 10.00
      }
    ]
  })

  console.log('✅ Order items created')

  // Create Payments
  console.log('💳 Creating payments...')
  
  await prisma.payment.createMany({
    data: [
      {
        orderId: order1.id,
        provider: 'PAYNOW',
        status: 'PAID',
        amount: 5.00,
        paynowReference: 'PAYNOW-REF-001',
        paynowStatusMsg: 'Payment successful'
      },
      {
        orderId: order2.id,
        provider: 'PAYNOW',
        status: 'PENDING',
        amount: 10.00,
        paynowReference: 'PAYNOW-REF-002',
        paynowStatusMsg: 'Awaiting payment'
      }
    ]
  })

  console.log('✅ Payments created')

  // Create Ad Packages
  console.log('📢 Creating ad packages...')
  
  const basicPackage = await prisma.adPackage.create({
    data: {
      name: 'Basic Package',
      advertsIncluded: 2,
      monthlyPrice: 50.00,
      active: true
    }
  })

  const premiumPackage = await prisma.adPackage.create({
    data: {
      name: 'Premium Package',
      advertsIncluded: 5,
      monthlyPrice: 100.00,
      active: true
    }
  })

  const enterprisePackage = await prisma.adPackage.create({
    data: {
      name: 'Enterprise Package',
      advertsIncluded: 10,
      monthlyPrice: 200.00,
      active: true
    }
  })

  console.log('✅ Ad packages created')

  // Create Advertisers
  console.log('🏢 Creating advertisers...')
  
  const advertiser1 = await prisma.advertiser.create({
    data: {
      name: 'Tech Solutions Ltd',
      email: 'marketing@techsolutions.co.zw',
      phone: '+263771234567',
      company: 'Tech Solutions Ltd',
      meta: {
        industry: 'Technology',
        website: 'https://techsolutions.co.zw'
      }
    }
  })

  const advertiser2 = await prisma.advertiser.create({
    data: {
      name: 'Local Restaurant',
      email: 'info@localrestaurant.co.zw',
      phone: '+263772345678',
      company: 'Local Restaurant',
      meta: {
        industry: 'Food & Beverage',
        website: 'https://localrestaurant.co.zw'
      }
    }
  })

  console.log('✅ Advertisers created')

  // Create Ad Subscriptions
  console.log('📋 Creating ad subscriptions...')
  
  await prisma.adSubscription.createMany({
    data: [
      {
        advertiserId: advertiser1.id,
        adPackageId: premiumPackage.id,
        startsAt: new Date('2024-01-01'),
        endsAt: new Date('2024-02-01'),
        remainingSlots: 3,
        active: true
      },
      {
        advertiserId: advertiser2.id,
        adPackageId: basicPackage.id,
        startsAt: new Date('2024-01-15'),
        endsAt: new Date('2024-02-15'),
        remainingSlots: 1,
        active: true
      }
    ]
  })

  console.log('✅ Ad subscriptions created')

  // Create Ads
  console.log('📺 Creating ads...')
  
  const ad1 = await prisma.ad.create({
    data: {
      advertiserId: advertiser1.id,
      title: 'Get Fast Internet Solutions',
      mediaUrl: 'https://example.com/tech-ad.jpg',
      targetUrl: 'https://techsolutions.co.zw/internet',
      htmlSnippet: '<div class="ad">Fast & Reliable Internet Solutions</div>',
      placementPage: 'SUCCESS',
      startsAt: new Date('2024-01-01'),
      endsAt: new Date('2024-02-01'),
      active: true,
      impressions: 150,
      clicks: 12
    }
  })

  const ad2 = await prisma.ad.create({
    data: {
      advertiserId: advertiser2.id,
      title: 'Delicious Food Near You',
      mediaUrl: 'https://example.com/restaurant-ad.jpg',
      targetUrl: 'https://localrestaurant.co.zw/menu',
      htmlSnippet: '<div class="ad">Best Local Cuisine</div>',
      placementPage: 'SUCCESS',
      startsAt: new Date('2024-01-15'),
      endsAt: new Date('2024-02-15'),
      active: true,
      impressions: 75,
      clicks: 8
    }
  })

  console.log('✅ Ads created')

  // Create Ad Location Links
  console.log('📍 Creating ad location links...')
  
  await prisma.adLocationLink.createMany({
    data: [
      {
        adId: ad1.id,
        locationId: harareCentral.id
      },
      {
        adId: ad1.id,
        locationId: bulawayoCentral.id
      },
      {
        adId: ad2.id,
        locationId: harareCentral.id
      }
    ]
  })

  console.log('✅ Ad location links created')

  // Create Audit Logs
  console.log('📝 Creating audit logs...')
  
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: superAdmin.id,
        action: 'USER_CREATED',
        entity: 'User',
        entityId: agent1.id,
        details: { email: agent1.email, role: agent1.role },
        ip: '192.168.1.1'
      },
      {
        actorId: superAdmin.id,
        action: 'LOCATION_CREATED',
        entity: 'Location',
        entityId: harareCentral.id,
        details: { name: harareCentral.name, code: harareCentral.code },
        ip: '192.168.1.1'
      },
      {
        actorId: admin.id,
        action: 'VOUCHER_BATCH_CREATED',
        entity: 'VoucherBatch',
        entityId: batch1Hour.id,
        details: { name: batch1Hour.name, retailPrice: batch1Hour.retailPrice },
        ip: '192.168.1.2'
      },
      {
        actorId: agent1.id,
        action: 'AGENT_SALE_CREATED',
        entity: 'AgentSale',
        entityId: 'agent-sale-1',
        details: { soldPrice: 2.50, buyerPhone: '+263777123456' },
        ip: '192.168.1.3'
      }
    ]
  })

  console.log('✅ Audit logs created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: 6 (1 Super Admin, 1 Admin, 2 Agents, 2 Customers)`)
  console.log(`- Agent Profiles: 2`)
  console.log(`- Locations: 4`)
  console.log(`- Voucher Batches: 4`)
  console.log(`- Vouchers: 65 (45 Available, 2 Sold, 7 Agent Sales)`)
  console.log(`- Agent Purchases: 2`)
  console.log(`- Agent Sales: 7`)
  console.log(`- Orders: 2`)
  console.log(`- Ad Packages: 3`)
  console.log(`- Advertisers: 2`)
  console.log(`- Ads: 2`)
  console.log(`- Audit Logs: 4`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
