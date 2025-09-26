import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // Get homepage page by slug
    const page = await executeQuery(
      `SELECT 
        p.*,
        u1.email as created_by_email,
        u2.email as updated_by_email
       FROM cms_pages p
       LEFT JOIN users u1 ON p.created_by = u1.id
       LEFT JOIN users u2 ON p.updated_by = u2.id
       WHERE p.slug = 'home'`,
      []
    )

    if (page.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Homepage not found'
      })
    }

    // Get page sections
    const sections = await executeQuery(
      `SELECT 
        s.*,
        (SELECT COUNT(*) FROM cms_content_blocks WHERE section_id = s.id AND is_active = 1) as blocks_count
       FROM cms_sections s
       WHERE s.page_id = ? AND s.is_active = 1
       ORDER BY s.order_index ASC`,
      [page[0].id]
    )

    // Get content blocks for each section
    for (const section of sections) {
      section.content_blocks = await executeQuery(
        `SELECT * FROM cms_content_blocks 
         WHERE section_id = ? AND is_active = 1
         ORDER BY order_index ASC`,
        [section.id]
      )
    }

    return {
      success: true,
      data: {
        page: page[0],
        sections
      }
    }

  } catch (error: any) {
    console.error('Error fetching homepage:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching homepage'
    })
  }
})
