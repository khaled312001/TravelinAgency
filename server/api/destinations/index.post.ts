import { defineEventHandler, readBody } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/destinations - Create new destination
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const {
      name_ar,
      name_en,
      description_ar,
      description_en,
      image_url,
      category = 'international',
      featured = false,
      active = true
    } = body;

    // Validate required fields
    if (!name_ar && !name_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination name is required'
      });
    }

    // Generate ID
    const id = `dest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert destination
    const insertQuery = `
      INSERT INTO destinations (
        id, name_ar, name_en, description_ar, description_en, 
        image_url, category, featured, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await executeQuery(insertQuery, [
      id,
      name_ar || null,
      name_en || null,
      description_ar || null,
      description_en || null,
      image_url || null,
      category,
      featured ? 1 : 0,
      active ? 1 : 0
    ]);

    // Get the created destination
    const destination = await executeQuery(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );

    return {
      success: true,
      message: 'Destination created successfully',
      data: destination[0]
    };

  } catch (error: any) {
    console.error('Error creating destination:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create destination'
    });
  }
});
