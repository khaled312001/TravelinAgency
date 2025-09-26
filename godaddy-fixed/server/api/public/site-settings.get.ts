import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // Get only public settings
    const settings = await executeQuery(
      'SELECT setting_key, setting_value, setting_type, category FROM cms_site_settings WHERE is_public = 1 ORDER BY category, setting_key'
    )

    // Group settings by category
    const groupedSettings = settings.reduce((acc: any, setting: any) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {}
      }
      acc[setting.category][setting.setting_key] = setting.setting_value
      return acc
    }, {})

    return {
      success: true,
      data: {
        settings: groupedSettings
      }
    }

  } catch (error: any) {
    console.error('Error fetching public site settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching site settings'
    })
  }
})
