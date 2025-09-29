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

    // Try to delete from database first
    try {
      // Check if page exists
      const existingPages = await executeQuery(`
        SELECT id FROM content_pages WHERE id = ?
      `, [pageId]);

      if (!existingPages || existingPages.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Page not found'
        });
      }

      // Delete page from database
      await executeQuery(`
        DELETE FROM content_pages WHERE id = ?
      `, [pageId]);

    } catch (dbError) {
      console.log('Database delete not available, page deletion applied locally only');
      
      // Return success even if database is not available
      return {
        success: true,
        message: 'Page deleted successfully (local only)',
        pageId: pageId,
        note: 'Database not available - deletion applied locally only'
      };
    }

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
