import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// DELETE /api/content/[id] - Delete content page
export default defineEventHandler(async (event) => {
  try {
    const pageId = getRouterParam(event, 'id');
    
    if (!pageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page ID is required'
      });
    }

    // Check if page exists
    const existingPages = await executeQuery(`
      SELECT id FROM cms_pages WHERE id = ?
    `, [pageId]);

    if (!existingPages || existingPages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      });
    }

    // Delete page sections first (cascade delete)
    await executeQuery(`
      DELETE FROM cms_sections WHERE page_id = ?
    `, [pageId]);

    // Delete content blocks for the sections
    await executeQuery(`
      DELETE FROM cms_content_blocks 
      WHERE section_id IN (
        SELECT id FROM cms_sections WHERE page_id = ?
      )
    `, [pageId]);

    // Delete page from MySQL database
    await executeQuery(`
      DELETE FROM cms_pages WHERE id = ?
    `, [pageId]);

    return {
      success: true,
      message: 'Page deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting page:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete page'
    });
  }
});
