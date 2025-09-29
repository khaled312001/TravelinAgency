import { defineEventHandler, getQuery } from 'h3'

// GET /api/pages/check-access?path=/about/ - Check if a page is accessible
export default defineEventHandler(async (event) => {
  try {
    const { path } = getQuery(event)
    
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Path is required'
      })
    }

    // Define page routes and their IDs
    const pageRoutes = {
      '/': 1,
      '/packages/': 2,
      '/custom-package/': 3,
      '/about/': 4
    }

    const pageId = pageRoutes[path as keyof typeof pageRoutes]
    
    if (!pageId) {
      return {
        success: true,
        accessible: true,
        reason: 'Not a main page'
      }
    }

    try {
      // Read page status from file
      const fs = await import('fs/promises')
      const path_module = await import('path')
      const statusFile = path_module.join(process.cwd(), 'page-statuses.json')
      
      const statusData = await fs.readFile(statusFile, 'utf-8')
      const pageStatuses = JSON.parse(statusData)
      
      const pageStatus = pageStatuses[pageId.toString()]
      const isPublished = pageStatus === 'published'
      
      return {
        success: true,
        accessible: isPublished,
        pageId: pageId,
        status: pageStatus,
        reason: isPublished ? 'Page is published' : 'Page is not published'
      }
      
    } catch (fileError) {
      // If file doesn't exist, assume page is accessible
      return {
        success: true,
        accessible: true,
        pageId: pageId,
        status: 'published',
        reason: 'Status file not found, assuming published'
      }
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to check page access'
    })
  }
})
