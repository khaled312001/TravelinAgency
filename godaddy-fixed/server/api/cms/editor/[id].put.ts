import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page ID is required'
    })
  }

  try {
    // Update page data
    await executeQuery(`
      UPDATE cms_pages SET
        title = ?,
        meta_title = ?,
        meta_description = ?,
        status = ?,
        template = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.title_ar || body.title || '',
      body.title_en || body.meta_title || '',
      body.meta_description_ar || body.meta_description || '',
      body.status || 'draft',
      body.template || 'default',
      id
    ])

    // Delete existing sections
    await executeQuery(`DELETE FROM cms_sections WHERE page_id = ?`, [id])

    // Insert new sections from components
    if (body.components && Array.isArray(body.components)) {
      for (let i = 0; i < body.components.length; i++) {
        const component = body.components[i]
        await executeQuery(`
          INSERT INTO cms_sections (
            page_id, section_type, title, subtitle, content,
            background_color, background_image, text_color, order_index, is_active, settings
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
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
      message: 'Page updated successfully'
    }
  } catch (error) {
    console.error('Error updating page:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update page'
    })
  }
})
