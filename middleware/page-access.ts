// Page access middleware to check if page is published
export default defineNuxtRouteMiddleware(async (to) => {
  // Only check for main website pages (not admin pages)
  if (to.path.startsWith('/admin/')) {
    return
  }

  // Normalize path (handle both with and without trailing slash)
  const normalizedPath = to.path.endsWith('/') ? to.path : to.path + '/'

  // Define page routes and their slugs
  const pageRoutes = {
    '/': '',
    '/packages/': 'packages',
    '/custom-package/': 'custom-package',
    '/about/': 'about'
  }

  // Check if current route is a main page
  const slug = pageRoutes[normalizedPath]
  if (slug === undefined) {
    return // Not a main page, allow access
  }

  try {
    // Check page status directly from file
    const fs = require('fs')
    const path = require('path')
    const statusFile = path.join(process.cwd(), 'page-statuses.json')
    
    if (fs.existsSync(statusFile)) {
      const statusData = fs.readFileSync(statusFile, 'utf-8')
      const pageStatuses = JSON.parse(statusData)
      
      // Map slugs to page IDs
      const slugToId = {
        '': 1,           // Home page
        'packages': 2,
        'custom-package': 3,
        'about': 4
      }
      
      const pageId = slugToId[slug]
      const pageStatus = pageStatuses[pageId.toString()]
      
      // If page is not published, show 404
      if (pageStatus === 'draft' || pageStatus === 'archived') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Page Not Found'
        })
      }
    }
  } catch (error) {
    // Only throw 404 if it's already a createError, otherwise allow access
    if (error.statusCode === 404) {
      throw error
    }
    // For other errors (like file reading issues), allow access
    console.warn('Page access middleware error:', error)
  }
})
