import { defineEventHandler } from 'h3';

// GET /api/debug/status-file - Debug endpoint to check status file
export default defineEventHandler(async (event) => {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const statusFile = path.join(process.cwd(), 'page-statuses.json')
    
    console.log('🔍 Debug: Looking for status file at:', statusFile)
    
    // Check if file exists
    try {
      await fs.access(statusFile)
      console.log('✅ Status file exists')
    } catch (accessError) {
      console.log('❌ Status file does not exist')
      return {
        success: false,
        error: 'Status file does not exist',
        path: statusFile
      }
    }
    
    // Read file content
    const statusData = await fs.readFile(statusFile, 'utf-8')
    console.log('📄 Raw file content:', statusData)
    
    // Parse JSON
    const pageStatuses = JSON.parse(statusData)
    console.log('📄 Parsed page statuses:', pageStatuses)
    
    return {
      success: true,
      data: {
        filePath: statusFile,
        rawContent: statusData,
        parsedStatuses: pageStatuses,
        page4Status: pageStatuses[4]
      }
    }
    
  } catch (error: any) {
    console.error('❌ Debug error:', error)
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
