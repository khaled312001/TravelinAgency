import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Only check for main website pages (not admin pages or API routes)
  if (event.node.req.url?.startsWith('/admin/') || event.node.req.url?.startsWith('/api/')) {
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
  const pageId = pageRoutes[event.node.req.url as keyof typeof pageRoutes]
  if (!pageId) {
    return // Not a main page, allow access
  }

  try {
    // Read page status from file
    const fs = await import('fs/promises')
    const path = await import('path')
    const statusFile = path.join(process.cwd(), 'page-statuses.json')
    
    const statusData = await fs.readFile(statusFile, 'utf-8')
    const pageStatuses = JSON.parse(statusData)
    
    const pageStatus = pageStatuses[pageId.toString()]
    
    // If page is not published, return 404
    if (pageStatus === 'draft' || pageStatus === 'archived') {
      event.node.res.statusCode = 404
      event.node.res.setHeader('Content-Type', 'text/html')
      event.node.res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #e53e3e; }
          </style>
        </head>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>This page is not available.</p>
        </body>
        </html>
      `)
      return
    }
  } catch (error) {
    // If there's any error reading the file, allow access (fallback)
    console.log('Could not check page status, allowing access')
  }
})
