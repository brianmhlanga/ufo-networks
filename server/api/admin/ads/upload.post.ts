import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
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

    // Get the uploaded file
    let formData: any[] | undefined = undefined
    try {
      formData = await readMultipartFormData(event)
    } catch (error) {
      console.error('Error reading multipart data:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to read uploaded file data'
      })
    }
    

    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // Find the file in the multipart data - use the same logic as test endpoint
    let file = formData.find(item => item.data && item.data.length > 0)
    
    // If no file found with data, try to find by name
    if (!file) {
      file = formData.find(item => item.name === 'file')
    }
    
    // If still no file, try to find by type
    if (!file) {
      file = formData.find(item => item.type === 'file')
    }
    
    if (!file || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file found in upload or file data is empty'
      })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type || '')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, MP4, AVI, MOV, WMV, FLV, PDF'
      })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (file.data && file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size too large. Maximum size is 10MB'
      })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename: ad-timestamp.extension
    const timestamp = Date.now()
    const originalName = file.filename || 'unknown'
    const extension = path.extname(originalName).toLowerCase()
    const filename = `ad-${timestamp}${extension}`
    
    // Save file
    const filePath = path.join(uploadsDir, filename)
    await writeFile(filePath, file.data)

    // Return the filename (this will be stored in mediaUrl)
    return {
      success: true,
      filename,
      originalName: file.filename,
      size: file.data.length,
      type: file.type,
      url: `/api/uploads/${filename}`
    }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file'
    })
  }
})
