import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Section ID is required'
      })
    }

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

    // Delete content blocks first (cascade delete)
    await executeQuery(
      'DELETE FROM cms_content_blocks WHERE section_id = ?',
      [id]
    )

    // Delete the section
    await executeQuery(
      'DELETE FROM cms_sections WHERE id = ?',
      [id]
    )

    return {
      success: true,
      message: 'Section deleted successfully'
    }

  } catch (error: any) {
    console.error('Error deleting section:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting section'
    })
  }
})
