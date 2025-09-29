import { defineEventHandler, getRouterParam } from 'h3';

// GET /api/pages/[slug]/status - Check if a page is published
export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page slug is required'
      });
    }

    // Map slugs to page IDs
    const slugToId = {
      '': 1,           // Home page
      'packages': 2,
      'custom-package': 3,
      'about': 4
    };

    const pageId = slugToId[slug];
    
    if (!pageId) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      });
    }

    // Read page status from file
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const statusFile = path.join(process.cwd(), 'page-statuses.json');
      
      const statusData = await fs.readFile(statusFile, 'utf-8');
      const pageStatuses = JSON.parse(statusData);
      
      const pageStatus = pageStatuses[pageId.toString()] || 'published';
      
      return {
        success: true,
        pageId: pageId,
        slug: slug,
        status: pageStatus,
        isPublished: pageStatus === 'published'
      };
      
    } catch (fileError) {
      // If file doesn't exist, assume page is published
      return {
        success: true,
        pageId: pageId,
        slug: slug,
        status: 'published',
        isPublished: true
      };
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to check page status'
    });
  }
});
