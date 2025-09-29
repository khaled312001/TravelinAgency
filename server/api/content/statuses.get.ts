import { defineEventHandler } from 'h3';

// GET /api/content/statuses - Get all page statuses
export default defineEventHandler(async (event) => {
  try {
    // Get page statuses from saved file
    let pageStatuses = {}
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const statusFile = path.join(process.cwd(), 'page-statuses.json')
      const statusData = await fs.readFile(statusFile, 'utf-8')
      pageStatuses = JSON.parse(statusData)
    } catch (fileError) {
      console.log('No saved page statuses found, using defaults')
      pageStatuses = { 1: 'published', 2: 'published', 3: 'published', 4: 'published' }
    }

    return {
      success: true,
      data: {
        statuses: pageStatuses
      },
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('Error fetching page statuses:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page statuses'
    })
  }
})
