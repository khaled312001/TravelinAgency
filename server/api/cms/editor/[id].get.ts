import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/cms/editor/[id] - Get page data for editor/preview
export default defineEventHandler(async (event) => {
  try {
    const pageId = getRouterParam(event, 'id');
  
    if (!pageId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page ID is required'
      });
  }

    // Try to get page from database first
  try {
      const page = await executeQuery(`
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
          components,
        created_at,
        updated_at
        FROM content_pages 
      WHERE id = ?
      `, [pageId]);
      
      if (page && page.length > 0) {
        const pageData = page[0];
        
        // Parse components from JSON string
        let components = [];
        try {
          if (pageData.components) {
            components = typeof pageData.components === 'string' 
              ? JSON.parse(pageData.components) 
              : pageData.components;
          }
        } catch (e) {
          console.log('Error parsing components:', e);
          components = [];
        }
        
        // Format page data for editor/preview
        const formattedPage = {
          id: pageData.id,
          title: pageData.title_ar || pageData.title_en,
          title_ar: pageData.title_ar,
          title_en: pageData.title_en,
          content: pageData.content_ar || pageData.content_en,
          content_ar: pageData.content_ar,
          content_en: pageData.content_en,
          type: pageData.type || 'page',
          status: pageData.status || 'draft',
          url: pageData.url || `/${pageData.slug || ''}`,
          slug: pageData.slug,
          created_at: pageData.created_at,
          updated_at: pageData.updated_at,
          components: components
        };

        return {
          success: true,
          message: 'Page retrieved successfully from database',
          page: formattedPage
        };
      }
    } catch (dbError) {
      console.log('Database page not available, using default page data...');
    }
    
    // Fallback to default page data based on ID
    const defaultPages = {
      '1': {
        id: 1,
        title_ar: 'الصفحة الرئيسية',
        title_en: 'Home Page',
        content_ar: 'الصفحة الرئيسية لموقع وكالة السفر',
        content_en: 'Main homepage of the travel agency website',
        type: 'page',
        status: 'published',
        url: '/',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      '2': {
        id: 2,
        title_ar: 'الباقات السياحية',
        title_en: 'Travel Packages',
        content_ar: 'عرض جميع الباقات السياحية المتاحة',
        content_en: 'View all available travel packages',
        type: 'page',
        status: 'published',
        url: '/packages/',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      '3': {
        id: 3,
        title_ar: 'باقة مخصصة',
        title_en: 'Custom Package',
        content_ar: 'إنشاء باقة سياحية مخصصة حسب احتياجاتك',
        content_en: 'Create a custom travel package according to your needs',
        type: 'page',
        status: 'published',
        url: '/custom-package/',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString()
      },
      '4': {
        id: 4,
        title_ar: 'من نحن',
        title_en: 'About Us',
        content_ar: 'تعرف على وكالة السفر وخدماتنا',
        content_en: 'Learn about our travel agency and services',
        type: 'page',
        status: 'published',
        url: '/about/',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString()
      }
    };

    const defaultPage = defaultPages[pageId];
    
    if (defaultPage) {
      // إضافة مكونات افتراضية حسب نوع الصفحة
      let defaultComponents = [];
      
      if (pageId === '1') {
        // الصفحة الرئيسية
        defaultComponents = [
          {
            type: 'hero',
            props: {
              title: 'مرحباً بك في Wonder Land',
              subtitle: 'اكتشف أجمل الوجهات السياحية',
              backgroundImage: '/images/hero-bg.jpg',
              buttonText: 'اكتشف الآن',
              buttonLink: '/packages'
            }
          },
          {
            type: 'about',
            props: {
              title: 'من نحن',
              content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل خدمات السفر والسياحة لعملائنا الكرام.',
              image: '/images/about.jpg'
            }
          }
        ];
      } else if (pageId === '2') {
        // الباقات السياحية
        defaultComponents = [
          {
            type: 'heading',
            props: {
              title: 'الباقات السياحية',
              subtitle: 'اكتشف أفضل العروض والرحلات'
            }
          },
          {
            type: 'services',
            props: {
              title: 'باقاتنا المميزة',
              services: [
                { title: 'باقة دبي', description: 'رحلة لمدة 3 أيام', price: '1500 ريال' },
                { title: 'باقة تركيا', description: 'رحلة لمدة 5 أيام', price: '2500 ريال' },
                { title: 'باقة ماليزيا', description: 'رحلة لمدة 7 أيام', price: '3500 ريال' }
              ]
            }
          }
        ];
      } else if (pageId === '3') {
        // باقة مخصصة
        defaultComponents = [
          {
            type: 'heading',
            props: {
              title: 'باقة مخصصة',
              subtitle: 'صمم رحلتك حسب احتياجاتك'
            }
          },
          {
            type: 'contact',
            props: {
              title: 'تواصل معنا',
              description: 'أخبرنا عن رحلتك المثالية وسنساعدك في تصميمها'
            }
          }
        ];
      } else if (pageId === '4') {
        // من نحن
        defaultComponents = [
          {
            type: 'heading',
            props: {
              title: 'من نحن',
              subtitle: 'تعرف على وكالة السفر وخدماتنا'
            }
          },
          {
            type: 'about',
            props: {
              title: 'قصتنا',
              content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل خدمات السفر والسياحة لعملائنا الكرام. نسعى دائماً لتوفير تجارب سفر لا تُنسى.',
              image: '/images/about.jpg'
            }
          },
          {
            type: 'testimonials',
            props: {
              title: 'آراء عملائنا',
              testimonials: [
                { name: 'أحمد محمد', text: 'تجربة رائعة، شكراً لكم' },
                { name: 'فاطمة علي', text: 'خدمة ممتازة ورحلة لا تُنسى' }
              ]
            }
          }
        ];
      }

    return {
      success: true,
        message: 'Page retrieved successfully from default data',
      page: {
          ...defaultPage,
          title: defaultPage.title_ar || defaultPage.title_en,
          content: defaultPage.content_ar || defaultPage.content_en,
          components: defaultComponents
        }
      };
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      });
    }

  } catch (error: any) {
    console.error('Error fetching page for editor:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page data'
    });
  }
});