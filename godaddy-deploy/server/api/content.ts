import { defineEventHandler, getMethod, readBody } from 'h3';
import { executeQuery } from '~/utils/database';

// Handle different HTTP methods
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  switch (method) {
    case 'GET':
      return await getContentPages();
    case 'POST':
      return await createContentPage(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      });
  }
});

// GET /api/content - Get all content pages
async function getContentPages() {
  try {
      // Get content pages from MySQL database
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
        ORDER BY created_at DESC
      `);

    // Format to match expected structure
    return {
      success: true,
      pages: pages.map(page => ({
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
      }))
    };
  } catch (error) {
    console.error('Error fetching content pages:', error);
    return { 
      success: false,
      error: 'Failed to fetch content pages',
      pages: []
    };
  }
}

// POST /api/content - Create new content page
async function createContentPage(event) {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.content_ar || !body.content_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      });
    }

    // Insert new content page
    const result = await executeQuery(`
      INSERT INTO cms_pages (
        title, meta_title, meta_description, 
        status, template, created_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      body.title_ar || body.title,
      body.title_en || body.meta_title,
      body.content_ar || body.meta_description,
      body.status || 'draft',
      body.template || 'default',
      1 // Default admin user ID
    ]);

    return {
      success: true,
      message: 'Content page created successfully',
      id: result.insertId
    };
  } catch (error) {
    console.error('Error creating content page:', error);
    return { 
      success: false,
      error: 'Failed to create content page'
    };
  }
}
