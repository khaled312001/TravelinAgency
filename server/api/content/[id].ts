import { defineEventHandler, getMethod, readBody, getRouterParam } from 'h3';
import { executeQuery } from '~/utils/database';

// Handle different HTTP methods for single content page
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID is required'
    });
  }

  switch (method) {
    case 'GET':
      return await getContentPage(id);
    case 'PUT':
      return await updateContentPage(event, id);
    case 'DELETE':
      return await deleteContentPage(id);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      });
  }
});

// GET /api/content/[id] - Get single content page
async function getContentPage(id: string) {
  try {
    const pages = await executeQuery(`
      SELECT 
        id, 
        title,
        meta_title,
        meta_description,
        'page' as type,
        status,
        template,
        created_at,
        updated_at
      FROM cms_pages 
      WHERE id = ?
    `, [id]);

    if (!pages || pages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content page not found'
      });
    }

    const page = pages[0];

    return {
      success: true,
      page: {
        id: page.id,
        title: page.title,
        title_ar: page.title, // Use title as Arabic title
        title_en: page.meta_title || page.title, // Use meta_title as English title
        content: page.meta_description || '',
        content_ar: page.meta_description || '',
        content_en: page.meta_description || '',
        type: page.type,
        status: page.status,
        template: page.template,
        created_at: page.created_at,
        updated_at: page.updated_at
      }
    };
  } catch (error) {
    console.error('Error fetching content page:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch content page'
    });
  }
}

// PUT /api/content/[id] - Update content page
async function updateContentPage(event: any, id: string) {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.content_ar || !body.content_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      });
    }

    // Update content page
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
      body.title_ar || body.title,
      body.title_en || body.meta_title,
      body.content_ar || body.meta_description,
      body.status || 'draft',
      body.template || 'default',
      id
    ]);

    return {
      success: true,
      message: 'Content page updated successfully'
    };
  } catch (error) {
    console.error('Error updating content page:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update content page'
    });
  }
}

// DELETE /api/content/[id] - Delete content page
async function deleteContentPage(id: string) {
  try {
    // Check if page exists
    const pages = await executeQuery(`
      SELECT id FROM cms_pages WHERE id = ?
    `, [id]);

    if (!pages || pages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content page not found'
      });
    }

    // Delete content page
    await executeQuery(`
      DELETE FROM cms_pages WHERE id = ?
    `, [id]);

    return {
      success: true,
      message: 'Content page deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting content page:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete content page'
    });
  }
}
