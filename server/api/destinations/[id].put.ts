import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/destinations/[id] - Update destination
export default defineEventHandler(async (event) => {
  try {
    const destinationId = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!destinationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      });
    }

    // Validate required fields
    if (!body.name_ar || !body.name_en || !body.description_ar || !body.description_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and description in both languages are required'
      });
    }

    // Update destination in MySQL database
    const result = await executeQuery(`
      UPDATE destinations SET
        name_ar = ?,
        name_en = ?,
        description_ar = ?,
        description_en = ?,
        image_url = ?,
        category = ?,
        featured = ?,
        active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.name_ar,
      body.name_en,
      body.description_ar,
      body.description_en,
      body.image_url || null,
      body.category || 'international',
      body.featured ? 1 : 0,
      body.active ? 1 : 0,
      destinationId
    ]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Destination not found'
      });
    }

    // Get the updated destination
    const updatedDestinations = await executeQuery(`
      SELECT 
        id, 
        name_ar,
        name_en,
        description_ar,
        description_en,
        image_url,
        category,
        featured,
        active,
        created_at,
        updated_at
      FROM destinations 
      WHERE id = ?
    `, [destinationId]);

    if (!updatedDestinations || updatedDestinations.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve updated destination'
      });
    }

    const destinationData = updatedDestinations[0];

    // Format the response
    return {
      success: true,
      message: 'Destination updated successfully',
      data: {
        id: destinationData.id,
        name: destinationData.name_ar || destinationData.name_en,
        name_ar: destinationData.name_ar,
        name_en: destinationData.name_en,
        description: destinationData.description_ar || destinationData.description_en,
        description_ar: destinationData.description_ar,
        description_en: destinationData.description_en,
        image: destinationData.image_url,
        image_url: destinationData.image_url,
        category: destinationData.category,
        featured: destinationData.featured === 1,
        active: destinationData.active === 1,
        status: destinationData.active === 1 ? 'active' : 'inactive',
        region_ar: destinationData.category === 'saudi' ? 'السعودية' : 'دولي',
        region_en: destinationData.category === 'saudi' ? 'Saudi Arabia' : 'International',
        location_type_ar: 'وجهة',
        location_type_en: 'Destination',
        destination_type_ar: destinationData.category === 'saudi' ? 'محلي' : 'دولي',
        destination_type_en: destinationData.category === 'saudi' ? 'Domestic' : 'International',
        coordinates: null,
        created_at: destinationData.created_at,
        updated_at: destinationData.updated_at
      }
    };

  } catch (error: any) {
    console.error('Error updating destination:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update destination'
    });
  }
});
