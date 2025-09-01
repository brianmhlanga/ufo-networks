import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError, getQuery } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { 
      category = '', 
      sortBy = 'rating-desc',
      page = 1,
      limit = 20,
      search = ''
    } = query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Build where clause for companies
    const whereClause: any = {}
    
    if (category && category !== 'All') {
      whereClause.categories = {
        some: {
          category: {
            name: category
          }
        }
      }
    }
    
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Build orderBy clause
    let orderBy: any = {}
    if (sortBy === 'rating-desc') {
      orderBy = { reviews: { _count: 'desc' } } // Will be handled in application logic
    } else if (sortBy === 'rating-asc') {
      orderBy = { reviews: { _count: 'asc' } } // Will be handled in application logic
    } else if (sortBy === 'reviews-desc') {
      orderBy = { reviews: { _count: 'desc' } }
    } else if (sortBy === 'reviews-asc') {
      orderBy = { reviews: { _count: 'asc' } }
    } else {
      orderBy = { name: 'asc' } // Default sort
    }

    // Get companies with their reviews and categories
    const companies = await prisma.company.findMany({
      where: whereClause,
      include: {
        reviews: {
          where: {
            status: 'APPROVED'
          }
        },
        categories: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      },
      skip,
      take
    })

    // Calculate stats for each company
    const companiesWithStats = companies.map(company => {
      const reviewCount = company.reviews.length
      const totalRating = company.reviews.reduce((sum, review) => sum + review.rating, 0)
      const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0
      const primaryCategory = company.categories[0]?.category?.name || 'General'

      return {
        id: company.id,
        name: company.name,
        logo: company.logo ? `/api/uploads/${company.logo}` : null,
        industry: primaryCategory,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        totalReviews: reviewCount,
        website: company.website || '',
        verified: company.isVerified || false
      }
    })

    // Apply sorting in application logic for rating-based sorts
    let sortedCompanies = companiesWithStats
    if (sortBy === 'rating-desc') {
      sortedCompanies = companiesWithStats.sort((a, b) => b.avgRating - a.avgRating)
    } else if (sortBy === 'rating-asc') {
      sortedCompanies = companiesWithStats.sort((a, b) => a.avgRating - b.avgRating)
    } else if (sortBy === 'reviews-desc') {
      sortedCompanies = companiesWithStats.sort((a, b) => b.totalReviews - a.totalReviews)
    } else if (sortBy === 'reviews-asc') {
      sortedCompanies = companiesWithStats.sort((a, b) => a.totalReviews - b.totalReviews)
    }

    // Get total count for pagination
    const totalCount = await prisma.company.count({ where: whereClause })

    return {
      success: true,
      companies: sortedCompanies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
        hasNextPage: skip + take < totalCount,
        hasPrevPage: Number(page) > 1
      }
    }

  } catch (error: any) {
    console.error('Error fetching companies:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
})
