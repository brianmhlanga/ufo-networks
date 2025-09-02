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

    // Get query parameters for date filtering
    const query = getQuery(event)
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string

    // Build date filter
    const dateFilter: any = {}
    if (dateFrom || dateTo) {
      dateFilter.startsAt = {}
      if (dateFrom) {
        dateFilter.startsAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        dateFilter.startsAt.lte = new Date(dateTo)
      }
    }

    // Get ad statistics
    const [
      totalAds,
      activeAds,
      totalImpressions,
      totalClicks,
      adsByPlacement,
      adsByAdvertiser,
      recentAds,
      topPerformingAds
    ] = await Promise.all([
      // Total ads count
      prisma.ad.count({ where: dateFilter }),
      
      // Active ads count
      prisma.ad.count({ 
        where: { 
          ...dateFilter,
          active: true 
        } 
      }),
      
      // Total impressions
      prisma.ad.aggregate({
        where: dateFilter,
        _sum: { impressions: true }
      }),
      
      // Total clicks
      prisma.ad.aggregate({
        where: dateFilter,
        _sum: { clicks: true }
      }),
      
      // Ads by placement page
      prisma.ad.groupBy({
        by: ['placementPage'],
        where: dateFilter,
        _count: { placementPage: true },
        _sum: { impressions: true, clicks: true }
      }),
      
      // Ads by advertiser
      prisma.ad.groupBy({
        by: ['advertiserId'],
        where: dateFilter,
        _count: { advertiserId: true },
        _sum: { impressions: true, clicks: true }
      }),
      
      // Recent ads (last 5)
      prisma.ad.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          advertiser: {
            select: {
              name: true,
              company: true
            }
          }
        }
      }),
      
      // Top performing ads by impressions
      prisma.ad.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { impressions: 'desc' },
        include: {
          advertiser: {
            select: {
              name: true,
              company: true
            }
          }
        }
      })
    ])

    // Get advertiser names for ads by advertiser
    const advertiserIds = adsByAdvertiser.map(item => item.advertiserId).filter(Boolean)
    const advertisers = await prisma.advertiser.findMany({
      where: { id: { in: advertiserIds } },
      select: { 
        id: true, 
        name: true,
        company: true
      }
    })

    // Map advertiser data
    const adsByAdvertiserWithNames = adsByAdvertiser.map(item => {
      const advertiser = advertisers.find(adv => adv.id === item.advertiserId)
      return {
        advertiserId: item.advertiserId,
        advertiserName: advertiser?.name || 'Unknown',
        company: advertiser?.company || 'No Company',
        adsCount: item._count.advertiserId,
        totalImpressions: item._sum.impressions || 0,
        totalClicks: item._sum.clicks || 0
      }
    })

    // Calculate click-through rate
    const clickThroughRate = totalImpressions._sum.impressions > 0 
      ? (totalClicks._sum.clicks || 0) / totalImpressions._sum.impressions * 100 
      : 0

    // Calculate average impressions per ad
    const averageImpressions = totalAds > 0 ? (totalImpressions._sum.impressions || 0) / totalAds : 0

    return {
      success: true,
      stats: {
        totalAds,
        activeAds,
        totalImpressions: totalImpressions._sum.impressions || 0,
        totalClicks: totalClicks._sum.clicks || 0,
        clickThroughRate: parseFloat(clickThroughRate.toFixed(2)),
        averageImpressions: parseFloat(averageImpressions.toFixed(2)),
        adsByPlacement,
        adsByAdvertiser: adsByAdvertiserWithNames,
        recentAds,
        topPerformingAds
      }
    }
  } catch (error) {
    console.error('Error fetching ad stats:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
