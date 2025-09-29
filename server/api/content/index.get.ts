import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/content - Get all content pages
export default defineEventHandler(async (event) => {
  try {
    // Try to get content from database first
    try {
      const content = await executeQuery(`
        SELECT 
          id, 
          title_ar,
          title_en,
          content_ar,
          content_en,
          type,
          status,
          url,
          slug,
          created_at,
          updated_at
        FROM content_pages 
        ORDER BY created_at DESC
      `);
      
      if (content && content.length > 0) {
        // Format database content data
        const formattedContent = content.map(page => ({
          id: page.id,
          title: page.title_ar || page.title_en,
          title_ar: page.title_ar,
          title_en: page.title_en,
          content: page.content_ar || page.content_en,
          content_ar: page.content_ar,
          content_en: page.content_en,
          type: page.type || 'page',
          status: page.status || 'draft',
          url: page.url || `/${page.slug || ''}`,
          created_at: page.created_at,
          updated_at: page.updated_at
        }));

        return {
          success: true,
          message: 'Content retrieved successfully from database',
          pages: formattedContent
        };
      }
    } catch (dbError) {
      // Silently handle database errors - this is expected when DB is not available
      // console.log('Database content not available, using default content...');
    }
    
    // Get saved page statuses from a simple file or use default
    let savedStatuses = {}
    try {
      // Try to read saved statuses from a simple JSON file
      const fs = await import('fs/promises')
      const path = await import('path')
      const statusFile = path.join(process.cwd(), 'page-statuses.json')
      const statusData = await fs.readFile(statusFile, 'utf-8')
      savedStatuses = JSON.parse(statusData)
    } catch (fileError) {
      // console.log('No saved page statuses found, using defaults')
      savedStatuses = {}
    }

    // Fallback to main website pages with saved statuses
    const defaultContent = [
      {
        id: 1,
        title_ar: 'الصفحة الرئيسية',
        title_en: 'Home Page',
        content_ar: 'الصفحة الرئيسية لموقع وكالة السفر',
        content_en: 'Main homepage of the travel agency website',
        type: 'page',
        status: savedStatuses[1] || 'published',
        url: '/',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title_ar: 'الباقات السياحية',
        title_en: 'Travel Packages',
        content_ar: 'عرض جميع الباقات السياحية المتاحة',
        content_en: 'View all available travel packages',
        type: 'page',
        status: savedStatuses[2] || 'published',
        url: '/packages/',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title_ar: 'باقة مخصصة',
        title_en: 'Custom Package',
        content_ar: 'إنشاء باقة سياحية مخصصة حسب احتياجاتك',
        content_en: 'Create a custom travel package according to your needs',
        type: 'page',
        status: savedStatuses[3] || 'published',
        url: '/custom-package/',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        title_ar: 'من نحن',
        title_en: 'About Us',
        content_ar: 'تعرف على وكالة السفر وخدماتنا',
        content_en: 'Learn about our travel agency and services',
        type: 'page',
        status: savedStatuses[4] || 'published',
        url: '/about/',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    return {
      success: true,
      message: 'Content retrieved successfully from default data',
      pages: defaultContent
    };

  } catch (error: any) {
    console.error('Error fetching content:', error);
    
    // Return a more detailed error response
    return {
      success: false,
      message: 'Failed to fetch content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      pages: []
    };
  }
});
