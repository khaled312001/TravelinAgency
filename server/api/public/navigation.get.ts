import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { menu_name } = query

    let sql = `
      SELECT 
        n.id, n.menu_name, n.title, n.url, n.page_id, n.parent_id, n.order_index, n.target, n.icon,
        p.slug as page_slug
      FROM cms_navigation n
      LEFT JOIN cms_pages p ON n.page_id = p.id AND p.status = 'published'
      WHERE n.is_active = 1
    `
    const params: any[] = []

    if (menu_name) {
      sql += ' AND n.menu_name = ?'
      params.push(menu_name)
    }

    sql += ' ORDER BY n.menu_name, n.order_index ASC'

    const navigation = await executeQuery(sql, params)

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
      }
    }

  } catch (error: any) {
    console.error('Error fetching public navigation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching navigation'
    })
  }
})
