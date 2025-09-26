import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/packages - Create new package
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.description_ar || !body.description_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and description in both languages are required'
      });
    }

    // Create package in MySQL database
    const result = await executeQuery(`
      INSERT INTO packages (
        title_ar,
        title_en,
        description_ar,
        description_en,
        price,
        duration_days,
        travel_period,
        max_persons,
        image_url,
        featured,
        active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      body.title_ar,
      body.title_en,
      body.description_ar,
      body.description_en,
      body.price || 0,
      body.duration_days || 1,
      body.travel_period || '',
      body.max_persons || 10,
      body.image_url || '',
      body.featured ? 1 : 0,
      body.status === 'active' ? 1 : 0
    ]);

    // Get the created package
    const createdPackages = await executeQuery(`
      SELECT 
        id, 
        title_ar,
        title_en,
        description_ar,
        description_en,
        price,
        duration_days as duration,
        image_url as image,
        travel_period as location,
        featured,
        active as status,
        created_at,
        updated_at
      FROM packages 
      WHERE id = ?
    `, [result.insertId]);

    if (!createdPackages || createdPackages.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve created package'
      });
    }

    const packageData = createdPackages[0];

    return {
      success: true,
      id: packageData.id,
      package: {
        id: packageData.id,
        image_url: packageData.image,
        title_ar: packageData.title_ar,
        title_en: packageData.title_en,
        description_ar: packageData.description_ar,
        description_en: packageData.description_en,
        travel_period: packageData.location,
        duration_days: packageData.duration,
        price: packageData.price,
        max_persons: 10,
        featured: packageData.featured,
        location: packageData.location,
        status: packageData.status,
        created_at: packageData.created_at,
        updated_at: packageData.updated_at
      }
    };
  } catch (error) {
    console.error('Error creating package:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create package'
    });
  }
});
