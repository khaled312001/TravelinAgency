export const useSettings = () => {
  const settings = ref({})
  const loading = ref(false)
  const error = ref(null)

  // تحميل الإعدادات
  const loadSettings = async (publicOnly = false) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await $fetch('/api/cms/site-settings', {
        query: { public_only: publicOnly }
      })
      
      if (result && result.data) {
        settings.value = result.data.flatObject || {}
      }
      
      return settings.value
    } catch (err) {
      error.value = err
      console.error('Error loading settings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // الحصول على إعداد محدد
  const getSetting = (key: string, defaultValue: any = '') => {
    return settings.value[key] || defaultValue
  }

  // الحصول على إعدادات فئة معينة
  const getSettingsByCategory = (category: string) => {
    const result: any = {}
    Object.keys(settings.value).forEach(key => {
      if (key.startsWith(category + '_') || key.includes(category)) {
        result[key] = settings.value[key]
      }
    })
    return result
  }

  // إعدادات الموقع العامة
  const siteSettings = computed(() => ({
    name_ar: getSetting('site_name_ar', 'Wonder Land'),
    name_en: getSetting('site_name_en', 'Wonder Land'),
    tagline_ar: getSetting('site_tagline_ar', 'وكالة السفر الرائدة'),
    tagline_en: getSetting('site_tagline_en', 'Leading Travel Agency'),
    description_ar: getSetting('site_description_ar', 'وكالة سفر رائدة في المملكة العربية السعودية'),
    description_en: getSetting('site_description_en', 'Leading travel agency in Saudi Arabia'),
    logo: getSetting('site_logo', '/images/logo.png')
  }))

  // إعدادات التواصل
  const contactSettings = computed(() => ({
    email: getSetting('contact_email', 'info@wonderland.com'),
    phone: getSetting('contact_phone', '+966501234567'),
    whatsapp: getSetting('contact_whatsapp', '+966501234567'),
    address: getSetting('contact_address', 'الرياض، المملكة العربية السعودية'),
    website: getSetting('website_url', 'https://wonderland.com')
  }))

  // إعدادات وسائل التواصل الاجتماعي
  const socialSettings = computed(() => ({
    facebook: getSetting('social_facebook', ''),
    twitter: getSetting('social_twitter', ''),
    instagram: getSetting('social_instagram', ''),
    youtube: getSetting('social_youtube', ''),
    linkedin: getSetting('social_linkedin', ''),
    snapchat: getSetting('social_snapchat', '')
  }))

  // إعدادات SEO
  const seoSettings = computed(() => ({
    keywords: getSetting('seo_keywords', 'سفر، سياحة، رحلات، السعودية'),
    description: getSetting('seo_description', 'اكتشف أفضل الوجهات السياحية مع Wonder Land'),
    googleAnalytics: getSetting('google_analytics', ''),
    googleTagManager: getSetting('google_tag_manager', ''),
    facebookPixel: getSetting('facebook_pixel', '')
  }))

  // إعدادات النظام
  const systemSettings = computed(() => ({
    defaultLanguage: getSetting('default_language', 'ar'),
    timezone: getSetting('timezone', 'Asia/Riyadh'),
    defaultCurrency: getSetting('default_currency', 'SAR'),
    itemsPerPage: parseInt(getSetting('items_per_page', '20')),
    maintenanceMode: getSetting('maintenance_mode', 'false') === 'true',
    allowRegistration: getSetting('allow_registration', 'true') === 'true',
    enableNotifications: getSetting('enable_notifications', 'true') === 'true',
    enableAnalytics: getSetting('enable_analytics', 'true') === 'true'
  }))

  // إعدادات الأمان
  const securitySettings = computed(() => ({
    sessionTimeout: parseInt(getSetting('session_timeout', '60')),
    maxLoginAttempts: parseInt(getSetting('max_login_attempts', '5')),
    require2FA: getSetting('require_2fa', 'false') === 'true',
    enableCaptcha: getSetting('enable_captcha', 'false') === 'true',
    logActivities: getSetting('log_activities', 'true') === 'true',
    forceHttps: getSetting('force_https', 'true') === 'true'
  }))

  // تحديث إعداد
  const updateSetting = async (key: string, value: any) => {
    try {
      await $fetch('/api/cms/site-settings', {
        method: 'PUT',
        body: {
          settings: [{
            setting_key: key,
            setting_value: value.toString(),
            setting_type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
            category: 'general',
            is_public: true
          }]
        }
      })
      
      // تحديث الإعداد محلياً
      settings.value[key] = value
      
      return true
    } catch (err) {
      console.error('Error updating setting:', err)
      throw err
    }
  }

  // تحديث عدة إعدادات
  const updateSettings = async (newSettings: Record<string, any>) => {
    try {
      const flatSettings = Object.keys(newSettings).map(key => ({
        setting_key: key,
        setting_value: newSettings[key].toString(),
        setting_type: typeof newSettings[key] === 'boolean' ? 'boolean' : typeof newSettings[key] === 'number' ? 'number' : 'text',
        category: 'general',
        is_public: true
      }))

      await $fetch('/api/cms/site-settings', {
        method: 'PUT',
        body: { settings: flatSettings }
      })
      
      // تحديث الإعدادات محلياً
      Object.assign(settings.value, newSettings)
      
      return true
    } catch (err) {
      console.error('Error updating settings:', err)
      throw err
    }
  }

  return {
    // البيانات
    settings: readonly(settings),
    loading: readonly(loading),
    error: readonly(error),
    
    // الإعدادات المجمعة
    siteSettings,
    contactSettings,
    socialSettings,
    seoSettings,
    systemSettings,
    securitySettings,
    
    // الوظائف
    loadSettings,
    getSetting,
    getSettingsByCategory,
    updateSetting,
    updateSettings
  }
}
