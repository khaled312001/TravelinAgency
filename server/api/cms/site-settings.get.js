export default defineEventHandler(async (event) => {
  try {
    // Return default site settings
    const defaultSettings = {
      site_name_ar: 'Wonder Land',
      site_name_en: 'Wonder Land',
      site_tagline_ar: 'وكالة السفر الرائدة',
      site_tagline_en: 'Leading Travel Agency',
      site_description_ar: 'وكالة سفر رائدة في المملكة العربية السعودية',
      site_description_en: 'Leading travel agency in Saudi Arabia',
      site_logo: '/images/logo.png',
      contact_email: 'info@wonderland.com',
      contact_phone: '+966501234567',
      contact_whatsapp: '+966501234567',
      contact_address: 'الرياض، المملكة العربية السعودية',
      website_url: 'https://wonderland.com',
      social_facebook: '',
      social_twitter: '',
      social_instagram: '',
      social_youtube: '',
      social_linkedin: '',
      social_snapchat: '',
      seo_keywords: 'سفر، سياحة، رحلات، السعودية، وكالة سفر',
      seo_description: 'اكتشف أفضل الوجهات السياحية مع Wonder Land وكالة السفر الرائدة في المملكة العربية السعودية',
      google_analytics: '',
      google_tag_manager: '',
      facebook_pixel: '',
      default_language: 'ar',
      timezone: 'Asia/Riyadh',
      default_currency: 'SAR',
      items_per_page: 20,
      maintenance_mode: false,
      allow_registration: true,
      enable_notifications: true,
      enable_analytics: true,
      session_timeout: 60,
      max_login_attempts: 5,
      require_2fa: false,
      enable_captcha: false,
      log_activities: true,
      force_https: true
    }
    
    return defaultSettings
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch site settings: ' + error.message
    })
  }
})
