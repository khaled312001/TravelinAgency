import { defineEventHandler, getRouterParam } from 'h3'
import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page ID is required'
    })
  }

  try {
    // Get page data
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
    `, [id])

    if (!pages || pages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    const page = pages[0]

    // Get sections for this page
    const sections = await executeQuery(`
      SELECT 
        id,
        section_type,
        title,
        subtitle,
        content,
        background_color,
        background_image,
        text_color,
        order_index,
        is_active,
        settings
      FROM cms_sections 
      WHERE page_id = ? AND is_active = TRUE
      ORDER BY order_index ASC
    `, [id])

    // Convert sections to components
    const components = sections.map(section => {
      // Parse settings if it's a JSON string
      let settings = {}
      if (section.settings && typeof section.settings === 'string') {
        try {
          settings = JSON.parse(section.settings)
        } catch (e) {
          console.error('Error parsing settings:', e)
        }
      } else if (section.settings) {
        settings = section.settings
      }

      // Create component props based on section type
      const props = {
        title: section.title || '',
        subtitle: section.subtitle || '',
        content: section.content || '',
        backgroundImage: section.background_image || '',
        backgroundColor: section.background_color || '',
        textColor: section.text_color || '',
        ...settings // Merge additional settings
      }

      // Add specific props based on component type
      if (section.section_type === 'hero') {
        props.buttonText = settings.buttonText || 'اكتشف الآن'
        props.buttonLink = settings.buttonLink || '/packages'
        props.videoBackground = settings.video_background || false
        props.desktopVideo = settings.desktop_video || ''
        props.mobileVideo = settings.mobile_video || ''
        props.posterImage = settings.poster_image || ''
      }

      return {
        id: section.id,
        type: section.section_type,
        props: props,
        classes: 'mb-6'
      }
    })

    return {
      success: true,
      page: {
        id: page.id,
        title: page.title,
        title_ar: page.title,
        title_en: page.meta_title || page.title,
        content: page.meta_description || '',
        content_ar: page.meta_description || '',
        content_en: page.meta_description || '',
        components: components,
        type: page.type,
        status: page.status,
        template: page.template,
        created_at: page.created_at,
        updated_at: page.updated_at
      }
    }
  } catch (error) {
    console.error('Error fetching page for editor:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page data'
    })
  }
})
