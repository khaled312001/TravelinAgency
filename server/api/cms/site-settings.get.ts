import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { category, public_only = false } = query

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

    const settings = await executeQuery(sql, params)

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
