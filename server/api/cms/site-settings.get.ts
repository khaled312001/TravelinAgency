import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { category, public_only = false } = query

    // Default site settings if database is not available
    const defaultSettings = [
      {
        id: 1,
        setting_key: 'siteName',
        setting_value: 'World Trip Agency',
        category: 'general',
        is_public: 1,
        description: 'Site name'
      },
      {
        id: 2,
        setting_key: 'siteDescription',
        setting_value: 'Your trusted travel partner for unforgettable experiences',
        category: 'general',
        is_public: 1,
        description: 'Site description'
      },
      {
        id: 3,
        setting_key: 'contactEmail',
        setting_value: 'info@worldtripagency.com',
        category: 'contact',
        is_public: 1,
        description: 'Contact email'
      },
      {
        id: 4,
        setting_key: 'contactPhone',
        setting_value: '+966 50 123 4567',
        category: 'contact',
        is_public: 1,
        description: 'Contact phone'
      }
    ];

    let settings;

    try {
      let sql = 'SELECT * FROM cms_site_settings WHERE 1=1'
      const params: any[] = []

      if (category) {
        sql += ' AND category = ?'
        params.push(category)
      }

      if (public_only === 'true') {
        sql += ' AND is_public = 1'
      }

      sql += ' ORDER BY category, setting_key'

      settings = await executeQuery(sql, params)
      
      if (!settings || settings.length === 0) {
        settings = defaultSettings;
      }
    } catch (dbError) {
      console.log('Database not available, using default settings');
      settings = defaultSettings;
    }

    // Group settings by category
    const groupedSettings = settings.reduce((acc: any, setting: any) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    }, {})

    // Convert flat settings to object for easy access
    const flatObject = settings.reduce((acc: any, setting: any) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})

    return {
      success: true,
      data: {
        settings: groupedSettings,
        flat: settings,
        flatObject: flatObject
      }
    }

  } catch (error: any) {
    console.error('Error fetching site settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching site settings'
    })
  }
})
