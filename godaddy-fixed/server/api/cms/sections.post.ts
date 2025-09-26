import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      page_id,
      section_type,
      title,
      subtitle,
      content,
      background_color,
      background_image,
      text_color,
      order_index = 0,
      settings = {}
    } = body

    if (!page_id || !section_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page ID and section type are required'
      })
    }

    // Check if page exists
    const page = await executeQuery(
      'SELECT id FROM cms_pages WHERE id = ?',
      [page_id]
    )

    if (page.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    const sql = `
      INSERT INTO cms_sections 
      (page_id, section_type, title, subtitle, content, background_color, background_image, text_color, order_index, settings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      page_id,
      section_type,
      title || null,
      subtitle || null,
      content || null,
      background_color || null,
      background_image || null,
      text_color || null,
      order_index,
      JSON.stringify(settings)
    ]

    const result = await executeQuery(sql, params) as any
    const sectionId = result.insertId

    // Get the created section
    const newSection = await executeQuery(
      'SELECT * FROM cms_sections WHERE id = ?',
      [sectionId]
    )

    // Parse settings JSON
    if (newSection[0].settings) {
      newSection[0].settings = JSON.parse(newSection[0].settings)
    }

    return {
      success: true,
      data: {
        section: newSection[0]
      },
      message: 'Section created successfully'
    }

  } catch (error: any) {
    console.error('Error creating section:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating section'
    })
  }
})
