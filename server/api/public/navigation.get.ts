import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { menu_name } = query

    let navigation = []
    
    // Try to get navigation from database first
    try {
      let sql = `
        SELECT 
          n.id, n.menu_name, n.title, n.url, n.page_id, n.parent_id, n.order_index, n.target, n.icon,
          p.slug as page_slug, p.status as page_status
        FROM cms_navigation n
        LEFT JOIN cms_pages p ON n.page_id = p.id
        WHERE n.is_active = 1
      `
      const params: any[] = []

      if (menu_name) {
        sql += ' AND n.menu_name = ?'
        params.push(menu_name)
      }

      sql += ' ORDER BY n.menu_name, n.order_index ASC'

      navigation = await executeQuery(sql, params)
      
      // Filter out items with unpublished pages
      navigation = navigation.filter(item => {
        if (!item.page_id) return true // External links are always shown
        return item.page_status === 'published'
      })
      
    } catch (dbError) {
      // Silently handle database errors - this is expected when DB is not available
      // console.log('Database navigation not available, using default navigation...')
      
      // Get page statuses from saved file
      let pageStatuses = {}
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        const statusFile = path.join(process.cwd(), 'page-statuses.json')
        // console.log('🔍 Looking for status file at:', statusFile)
        
        const statusData = await fs.readFile(statusFile, 'utf-8')
        pageStatuses = JSON.parse(statusData)
        // console.log('📄 Loaded page statuses from file:', pageStatuses)
        // console.log('📄 Page 4 status:', pageStatuses[4])
      } catch (fileError) {
        // Silently handle file errors - use default statuses
        // console.log('❌ Error reading page statuses file:', fileError)
        // console.log('No saved page statuses found, using default published status')
        pageStatuses = { 1: 'published', 2: 'published', 3: 'published', 4: 'published' }
      }
      
      // Fallback to default navigation based on our main pages
      const defaultNavigation = [
        { id: 1, menu_name: 'main', title: 'الرئيسية', url: '/', page_id: 1, order_index: 1, target: '_self', page_slug: null, page_status: pageStatuses[1] || 'published' },
        { id: 2, menu_name: 'main', title: 'الباقات', url: '/packages/', page_id: 2, order_index: 2, target: '_self', page_slug: 'packages', page_status: pageStatuses[2] || 'published' },
        { id: 3, menu_name: 'main', title: 'صمم باقتك', url: '/custom-package/', page_id: 3, order_index: 3, target: '_self', page_slug: 'custom-package', page_status: pageStatuses[3] || 'published' },
        { id: 4, menu_name: 'main', title: 'عن الشركة', url: '/about/', page_id: 4, order_index: 4, target: '_self', page_slug: 'about', page_status: pageStatuses[4] || 'published' }
      ]
      
      // Filter out unpublished pages
      // console.log('🔍 Before filtering - navigation items:', defaultNavigation.map(item => ({ id: item.id, title: item.title, status: item.page_status })))
      navigation = defaultNavigation.filter(item => {
        const isPublished = item.page_status === 'published'
        // console.log(`🔍 Page ${item.id} (${item.title}): status=${item.page_status}, isPublished=${isPublished}`)
        return isPublished
      })
      // console.log('🔍 After filtering - visible pages:', navigation.map(item => ({ id: item.id, title: item.title })))
    }

    // Build hierarchical structure
    const menuMap = new Map()
    const rootItems = []

    // First pass: create all items
    for (const item of navigation) {
      // Use page slug if available, otherwise use URL
      const finalUrl = item.page_slug ? `/${item.page_slug}` : item.url
      
      menuMap.set(item.id, {
        ...item,
        url: finalUrl,
        children: []
      })
    }

    // Second pass: build hierarchy
    for (const item of navigation) {
      if (item.parent_id) {
        const parent = menuMap.get(item.parent_id)
        if (parent) {
          parent.children.push(menuMap.get(item.id))
        }
      } else {
        rootItems.push(menuMap.get(item.id))
      }
    }

    // Group by menu name
    const groupedMenus = rootItems.reduce((acc: any, item: any) => {
      if (!acc[item.menu_name]) {
        acc[item.menu_name] = []
      }
      acc[item.menu_name].push(item)
      return acc
    }, {})

    return {
      success: true,
      data: {
        menus: groupedMenus
      },
      timestamp: new Date().toISOString(), // Add timestamp for cache busting
      cacheBuster: Date.now()
    }

  } catch (error: any) {
    console.error('Error fetching public navigation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching navigation'
    })
  }
})
