import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Section ID is required'
      })
    }

    const { 
      section_type,
      title,
      subtitle,
      content,
      background_color,
      background_image,
      text_color,
      order_index,
      is_active,
      settings
    } = body

    // Check if section exists
    const existingSection = await executeQuery(
      'SELECT id FROM cms_sections WHERE id = ?',
      [id]
    )

    if (existingSection.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Section not found'
      })
    }

    // Build update query dynamically
    const updateFields = []
    const params = []

    if (section_type !== undefined) {
      updateFields.push('section_type = ?')
      params.push(section_type)
    }
    if (title !== undefined) {
      updateFields.push('title = ?')
      params.push(title)
    }
    if (subtitle !== undefined) {
      updateFields.push('subtitle = ?')
      params.push(subtitle)
    }
    if (content !== undefined) {
      updateFields.push('content = ?')
      params.push(content)
    }
    if (background_color !== undefined) {
      updateFields.push('background_color = ?')
      params.push(background_color)
    }
    if (background_image !== undefined) {
      updateFields.push('background_image = ?')
      params.push(background_image)
    }
    if (text_color !== undefined) {
      updateFields.push('text_color = ?')
      params.push(text_color)
    }
    if (order_index !== undefined) {
      updateFields.push('order_index = ?')
      params.push(order_index)
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?')
      params.push(is_active)
    }
    if (settings !== undefined) {
      updateFields.push('settings = ?')
      params.push(JSON.stringify(settings))
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update'
      })
    }

    params.push(id)

    const sql = `UPDATE cms_sections SET ${updateFields.join(', ')} WHERE id = ?`

    await executeQuery(sql, params)

    // Get updated section
    const updatedSection = await executeQuery(
      'SELECT * FROM cms_sections WHERE id = ?',
      [id]
    )

    // Parse settings JSON
    if (updatedSection[0].settings) {
      updatedSection[0].settings = JSON.parse(updatedSection[0].settings)
    }

    return {
      success: true,
      data: {
        section: updatedSection[0]
      },
      message: 'Section updated successfully'
    }

  } catch (error: any) {
    console.error('Error updating section:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating section'
    })
  }
})
