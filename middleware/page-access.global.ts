export default defineNuxtRouteMiddleware(async (to) => {
  // Only check specific pages that need access control
  if (to.path === '/about' || to.path === '/about/') {
    try {
      // Read page status from file asynchronously
      const fs = await import('fs/promises')
      const path = await import('path')
      const statusFile = path.join(process.cwd(), 'page-statuses.json')
      
      try {
        const statusData = await fs.readFile(statusFile, 'utf-8')
        const pageStatuses = JSON.parse(statusData)
        
        if (pageStatuses[4] !== 'published') {
          throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found'
          })
        }
      } catch (fileError) {
        // If file doesn't exist or can't be read, allow access
        console.warn('Could not read page status file, allowing access:', fileError)
      }
    } catch (error) {
      // If check fails, allow access (fallback behavior)
      console.warn('Could not check page status in middleware, allowing access:', error)
    }
  }
})
