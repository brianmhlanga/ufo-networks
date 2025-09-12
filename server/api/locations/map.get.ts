import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    
    // Fetch all locations
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        town: true,
        area: true,
        province: true,
        latitude: true,
        longitude: true,
        _count: {
          select: {
            vouchers: {
              where: {
                status: { in: ['AVAILABLE', 'RESERVED'] },
                endDate: { gte: new Date() },
                startDate: { lte: new Date() }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Default coordinates for major Zimbabwe cities (fallback for locations without coordinates)
    const defaultCoords = {
      'Harare': [-17.8252, 31.0335],
      'Bulawayo': [-20.1486, 28.5801],
      'Mutare': [-18.9726, 32.6709],
      'Gweru': [-19.4563, 29.8148],
      'Kwekwe': [-18.9281, 29.8148],
      'Kadoma': [-18.3333, 29.9167],
      'Chinhoyi': [-17.3667, 30.2000],
      'Marondera': [-18.1833, 31.5500],
      'Chegutu': [-18.1333, 30.1333],
      'Bindura': [-17.3000, 31.3333],
      'Chitungwiza': [-18.0000, 31.0500],
      'Epworth': [-17.8833, 31.1500],
      'Ruwa': [-17.9167, 31.2333],
      'Norton': [-17.8833, 30.7000],
      'Chivhu': [-19.0167, 30.9000],
      'Masvingo': [-20.0667, 30.8333],
      'Zvishavane': [-20.3333, 30.0333],
      'Shurugwi': [-19.6667, 30.0000],
      'Gokwe': [-18.2167, 28.9333],
      'Plumtree': [-20.4833, 27.8167],
      'Beitbridge': [-22.2167, 30.0000],
      'Chiredzi': [-21.0500, 31.6667],
      'Triangle': [-20.1667, 31.0167],
      'Chipinge': [-20.2000, 32.6167],
      'Kariba': [-16.5167, 28.8000],
      'Karoi': [-16.8167, 29.6167],
      'Banket': [-17.3833, 30.4000],
      'Glendale': [-17.3500, 31.0667],
      'Mvurwi': [-17.6500, 30.8500],
      'Shamva': [-17.3167, 31.5500],
      'Mazowe': [-17.5167, 30.9667],
      'Goromonzi': [-17.8000, 31.3667],
      'Wedza': [-18.6333, 31.5667],
      'Murehwa': [-17.6500, 31.7833],
      'Mudzi': [-17.0167, 32.4167],
      'Victoria Falls': [-17.9243, 25.8572],
      'Hwange': [-18.3667, 26.5000],
      'Lupane': [-18.9333, 27.8000],
      'Tsholotsho': [-19.7667, 27.7000]
    }

    // Transform data for map
    const mapLocations = locations.map(location => {
      // Use provided coordinates or fallback to default based on town/province
      let coords = [location.latitude, location.longitude]
      
      if (!coords[0] || !coords[1]) {
        // Try to find coordinates based on town name
        const townKey = Object.keys(defaultCoords).find(key => 
          location.town?.toLowerCase().includes(key.toLowerCase()) ||
          location.name?.toLowerCase().includes(key.toLowerCase())
        )
        
        if (townKey) {
          coords = defaultCoords[townKey]
        } else {
          // Default to Harare if no match found
          coords = [-17.8252, 31.0335]
        }
      }

      return {
        id: location.id,
        name: location.name,
        code: location.code,
        town: location.town,
        area: location.area,
        province: location.province,
        coords: coords,
        type: location._count.vouchers > 0 ? 'active' : 'coming-soon',
        availableVouchers: location._count.vouchers,
        address: `${location.area || ''}${location.area && location.town ? ', ' : ''}${location.town || ''}${(location.area || location.town) && location.province ? ', ' : ''}${location.province || ''}`.trim()
      }
    })

    return {
      success: true,
      data: mapLocations,
      total: mapLocations.length,
      active: mapLocations.filter(l => l.type === 'active').length
    }
  } catch (error) {
    console.error('Error fetching map locations:', error)
    return {
      success: false,
      error: 'Failed to fetch locations',
      data: []
    }
  }
})
