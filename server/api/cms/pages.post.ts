import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      slug, 
      title, 
      meta_title, 
      meta_description, 
      meta_keywords, 
      status = 'draft', 
      template = 'default',
      created_by = 1 
    } = body

    if (!slug || !title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug and title are required'
      })
    }

    // Check if slug already exists
    const existingPage = await executeQuery(
      'SELECT id FROM cms_pages WHERE slug = ?',
      [slug]
    )

    if (existingPage.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page with this slug already exists'
      })
    }

    const sql = `
      INSERT INTO cms_pages 
      (slug, title, meta_title, meta_description, meta_keywords, status, template, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      slug,
      title,
      meta_title || null,
      meta_description || null,
      meta_keywords || null,
      status,
      template,
      created_by,
      created_by
    ]

    const result = await executeQuery(sql, params) as any
    const pageId = result.insertId

    // Get the created page
    const newPage = await executeQuery(
      'SELECT * FROM cms_pages WHERE id = ?',
      [pageId]
    )

    return {
      success: true,
      data: {
        page: newPage[0]
      },
      message: 'Page created successfully'
    }

  } catch (error: any) {
    console.error('Error creating page:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating page'
    })
  }
})
