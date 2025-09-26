import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { status, template, limit = 50, offset = 0 } = query

    let sql = `
      SELECT 
        p.*,
        u1.email as created_by_email,
        u2.email as updated_by_email
      FROM cms_pages p
      LEFT JOIN users u1 ON p.created_by = u1.id
      LEFT JOIN users u2 ON p.updated_by = u2.id
      WHERE 1=1
    `
    
    const params: any[] = []

    if (status) {
      sql += ' AND p.status = ?'
      params.push(status)
    }

    if (template) {
      sql += ' AND p.template = ?'
      params.push(template)
    }

    sql += ' ORDER BY p.updated_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit as string), parseInt(offset as string))

    const pages = await executeQuery(sql, params)

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM cms_pages WHERE 1=1'
    const countParams: any[] = []

    if (status) {
      countSql += ' AND status = ?'
      countParams.push(status)
    }

    if (template) {
      countSql += ' AND template = ?'
      countParams.push(template)
    }

    const countResult = await executeQuery(countSql, countParams)
    const total = countResult[0]?.total || 0

    return {
      success: true,
      data: {
        pages,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          pages: Math.ceil(total / parseInt(limit as string))
        }
      }
    }

  } catch (error: any) {
    console.error('Error fetching pages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching pages'
    })
  }
})
