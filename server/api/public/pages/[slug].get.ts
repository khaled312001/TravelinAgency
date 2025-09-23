import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page slug is required'
      })
    }

    // Get page details (only published pages)
    const page = await executeQuery(
      `SELECT 
        p.id, p.slug, p.title, p.meta_title, p.meta_description, p.meta_keywords, p.template
       FROM cms_pages p
       WHERE p.slug = ? AND p.status = 'published'`,
      [slug]
    )

    if (page.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Get page sections
    const sections = await executeQuery(
      `SELECT 
        s.id, s.section_type, s.title, s.subtitle, s.content, 
        s.background_color, s.background_image, s.text_color, s.order_index, s.settings
       FROM cms_sections s
       WHERE s.page_id = ? AND s.is_active = 1
       ORDER BY s.order_index ASC`,
      [page[0].id]
    )

    // Get content blocks for each section
    for (const section of sections) {
      section.content_blocks = await executeQuery(
        `SELECT 
          id, block_type, title, content, image_url, video_url, link_url, link_text, order_index, settings
         FROM cms_content_blocks 
         WHERE section_id = ? AND is_active = 1
         ORDER BY order_index ASC`,
        [section.id]
      )

      // Parse JSON settings
      if (section.settings) {
        try {
          section.settings = JSON.parse(section.settings)
        } catch (e) {
          section.settings = {}
        }
      }

      // Parse settings for content blocks
      section.content_blocks.forEach((block: any) => {
        if (block.settings) {
          try {
            block.settings = JSON.parse(block.settings)
          } catch (e) {
            block.settings = {}
          }
        }
      })
    }

    return {
      success: true,
      data: {
        page: page[0],
        sections
      }
    }

  } catch (error: any) {
    console.error('Error fetching public page:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching page'
    })
  }
})
