// Global middleware to check page status before rendering
export default defineNuxtRouteMiddleware((to) => {
  // Only check for main website pages (not admin pages)
  if (to.path.startsWith('/admin/')) {
    return
  }

  // Define page routes and their IDs
  const pageRoutes = {
    '/': 1,
    '/packages/': 2,
    '/custom-package/': 3,
    '/about/': 4
  }

  // Check if current route is a main page
  const pageId = pageRoutes[to.path]
  if (!pageId) {
    return // Not a main page, allow access
  }

  // Check page status from file
  try {
    const fs = require('fs')
    const path = require('path')
    const statusFile = path.join(process.cwd(), 'page-statuses.json')
    
    if (fs.existsSync(statusFile)) {
      const statusData = fs.readFileSync(statusFile, 'utf-8')
      const pageStatuses = JSON.parse(statusData)
      
      const pageStatus = pageStatuses[pageId.toString()]
      
      // If page is not published, redirect to 404
      if (pageStatus === 'draft' || pageStatus === 'archived') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Page Not Found'
        })
      }
    }
  } catch (error) {
    // If there's any error reading the file, allow access (fallback)
    console.log('Could not check page status, allowing access')
  }
})
