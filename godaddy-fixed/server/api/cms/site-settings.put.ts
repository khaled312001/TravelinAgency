import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { settings, updated_by = 1 } = body

    if (!settings || !Array.isArray(settings)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Settings array is required'
      })
    }

    const results = []

    for (const setting of settings) {
      const { setting_key, setting_value, setting_type, category, description, is_public } = setting

      if (!setting_key) {
        continue
      }

      // Check if setting exists
      const existing = await executeQuery(
        'SELECT id FROM cms_site_settings WHERE setting_key = ?',
        [setting_key]
      )

      if (existing.length > 0) {
        // Update existing setting
        const updateSql = `
          UPDATE cms_site_settings 
          SET setting_value = ?, setting_type = ?, category = ?, description = ?, is_public = ?, updated_by = ?
          WHERE setting_key = ?
        `
        await executeQuery(updateSql, [
          setting_value,
          setting_type || 'text',
          category || 'general',
          description || null,
          is_public || false,
          updated_by,
          setting_key
        ])
      } else {
        // Insert new setting
        const insertSql = `
          INSERT INTO cms_site_settings 
          (setting_key, setting_value, setting_type, category, description, is_public, updated_by)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        await executeQuery(insertSql, [
          setting_key,
          setting_value,
          setting_type || 'text',
          category || 'general',
          description || null,
          is_public || false,
          updated_by
        ])
      }

      results.push({ setting_key, updated: true })
    }

    return {
      success: true,
      data: {
        updated_settings: results
      },
      message: 'Site settings updated successfully'
    }

  } catch (error: any) {
    console.error('Error updating site settings:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating site settings'
    })
  }
})
