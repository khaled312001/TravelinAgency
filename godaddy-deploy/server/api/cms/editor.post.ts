import { defineEventHandler, readBody } from 'h3'
import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    // Generate slug from title
    const slug = (body.title_ar || body.title || 'new-page')
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Create new page
    const result = await executeQuery(`
      INSERT INTO cms_pages (
        slug,
        title, 
        meta_title, 
        meta_description, 
        status, 
        template, 
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      slug,
      body.title_ar || body.title || '',
      body.title_en || body.meta_title || '',
      body.meta_description_ar || body.meta_description || '',
      body.status || 'draft',
      body.template || 'default',
      1 // Default admin user ID
    ])

    const pageId = result.insertId

    // Insert sections from components
    if (body.components && Array.isArray(body.components)) {
      for (let i = 0; i < body.components.length; i++) {
        const component = body.components[i]
        await executeQuery(`
          INSERT INTO cms_sections (
            page_id, section_type, title, subtitle, content,
            background_color, background_image, text_color, order_index, is_active, settings
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          pageId,
          component.type || 'generic',
          component.props?.title || '',
          component.props?.subtitle || '',
          component.props?.content || '',
          component.props?.backgroundColor || '',
          component.props?.backgroundImage || '',
          component.props?.textColor || '',
          i,
          true,
          JSON.stringify(component.props || {})
        ])
      }
    }

    return {
      success: true,
      message: 'Page created successfully',
      id: pageId
    }
  } catch (error) {
    console.error('Error creating page:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create page'
    })
  }
})
