import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }
    
    const file = formData[0]
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      })
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File too large. Maximum size is 5MB.'
      })
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Generate unique filename
    const extension = file.filename.split('.').pop()
    const filename = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`
    const filepath = join(uploadsDir, filename)
    
    // Save file
    await writeFile(filepath, file.data)
    
    // Update site_logo setting in database
    try {
      const { executeQuery } = await import('~/utils/database')
      await executeQuery(
        "INSERT INTO cms_site_settings (setting_key, setting_value, setting_type, category, is_public) VALUES ('site_logo', ?, 'image', 'general', 1) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [`/uploads/${filename}`]
      )
    } catch (dbError) {
      console.error('Database update failed:', dbError)
      // Continue even if database update fails
    }
    
    // Return success response
    return {
      success: true,
      message: 'Image uploaded successfully',
      url: `/uploads/${filename}`,
      filename: filename
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Upload failed: ' + error.message
    })
  }
})
