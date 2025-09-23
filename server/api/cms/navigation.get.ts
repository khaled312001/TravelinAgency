import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { menu_name, active_only = true } = query

    let sql = `
      SELECT 
        n.*,
        p.slug as page_slug,
        p.title as page_title
      FROM cms_navigation n
      LEFT JOIN cms_pages p ON n.page_id = p.id
      WHERE 1=1
    `
    const params: any[] = []

    if (menu_name) {
      sql += ' AND n.menu_name = ?'
      params.push(menu_name)
    }

    if (active_only === 'true') {
      sql += ' AND n.is_active = 1'
    }

    sql += ' ORDER BY n.menu_name, n.order_index ASC'

    const navigation = await executeQuery(sql, params)

    // Build hierarchical structure
    const menuMap = new Map()
    const rootItems = []

    // First pass: create all items
    for (const item of navigation) {
      menuMap.set(item.id, {
        ...item,
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
        menus: groupedMenus,
        flat: navigation
      }
    }

  } catch (error: any) {
    console.error('Error fetching navigation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching navigation'
    })
  }
})
