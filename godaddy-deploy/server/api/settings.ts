import { defineEventHandler, getMethod, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/settings - Get system settings
export default defineEventHandler(async (event) => {
  try {
    if (getMethod(event) === 'GET') {
      // Get settings from MySQL database
      const settings = await executeQuery(`
        SELECT 
          setting_key,
          setting_value
        FROM cms_site_settings 
        ORDER BY setting_key
      `);

      // Convert array to object
      const settingsObj = {};
      settings.forEach(setting => {
        try {
          settingsObj[setting.setting_key] = JSON.parse(setting.setting_value);
        } catch {
          settingsObj[setting.setting_key] = setting.setting_value;
        }
      });

      return {
        settings: settingsObj
      };
    }

    if (getMethod(event) === 'PUT') {
      const body = await readBody(event);
      const { settings } = body;

      if (!settings) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Settings data is required'
        });
      }

      // Update settings in database
      for (const [key, value] of Object.entries(settings)) {
        await executeQuery(`
          INSERT INTO cms_site_settings (setting_key, setting_value) 
          VALUES (?, ?) 
          ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        `, [key, JSON.stringify(value)]);
      }

      return {
        success: true,
        message: 'Settings updated successfully'
      };
    }
  } catch (error) {
    console.error('Error with settings:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process settings request'
    });
  }
});
