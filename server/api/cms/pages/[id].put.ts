import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page ID is required'
      })
    }

    const { 
      slug, 
      title, 
      meta_title, 
      meta_description, 
      meta_keywords, 
      status, 
      template,
      updated_by = 1 
    } = body

    // Check if page exists
    const existingPage = await executeQuery(
      'SELECT id FROM cms_pages WHERE id = ?',
      [id]
    )

    if (existingPage.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Check if slug already exists (excluding current page)
    if (slug) {
      const slugCheck = await executeQuery(
        'SELECT id FROM cms_pages WHERE slug = ? AND id != ?',
        [slug, id]
      )

      if (slugCheck.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Page with this slug already exists'
        })
      }
    }

    // Build update query dynamically
    const updateFields = []
    const params = []

    if (slug !== undefined) {
      updateFields.push('slug = ?')
      params.push(slug)
    }
    if (title !== undefined) {
      updateFields.push('title = ?')
      params.push(title)
    }
    if (meta_title !== undefined) {
      updateFields.push('meta_title = ?')
      params.push(meta_title)
    }
    if (meta_description !== undefined) {
      updateFields.push('meta_description = ?')
      params.push(meta_description)
    }
    if (meta_keywords !== undefined) {
      updateFields.push('meta_keywords = ?')
      params.push(meta_keywords)
    }
    if (status !== undefined) {
      updateFields.push('status = ?')
      params.push(status)
    }
    if (template !== undefined) {
      updateFields.push('template = ?')
      params.push(template)
    }

    updateFields.push('updated_by = ?')
    params.push(updated_by)

    params.push(id)

    const sql = `UPDATE cms_pages SET ${updateFields.join(', ')} WHERE id = ?`

    await executeQuery(sql, params)

    // Get updated page
    const updatedPage = await executeQuery(
      'SELECT * FROM cms_pages WHERE id = ?',
      [id]
    )

    return {
      success: true,
      data: {
        page: updatedPage[0]
      },
      message: 'Page updated successfully'
    }

  } catch (error: any) {
    console.error('Error updating page:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating page'
    })
  }
})
