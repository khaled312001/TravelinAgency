import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/destinations/[id] - Get single destination
export default defineEventHandler(async (event) => {
  try {
    const destinationId = getRouterParam(event, 'id');
    
    if (!destinationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      });
    }

    // Get destination from MySQL database
    const destinations = await executeQuery(`
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
        region_ar,
        region_en,
        location_type_ar,
        location_type_en,
        destination_type_ar,
        destination_type_en,
        coordinates,
        created_at,
        updated_at
      FROM destinations 
      WHERE id = ?
    `, [destinationId]);

    if (!destinations || destinations.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Destination not found'
      });
    }

    const destinationData = destinations[0];

    // Format to match expected structure
    return {
      success: true,
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
        region_ar: destinationData.region_ar,
        region_en: destinationData.region_en,
        location_type_ar: destinationData.location_type_ar,
        location_type_en: destinationData.location_type_en,
        destination_type_ar: destinationData.destination_type_ar,
        destination_type_en: destinationData.destination_type_en,
        coordinates: destinationData.coordinates ? JSON.parse(destinationData.coordinates) : null,
        created_at: destinationData.created_at,
        updated_at: destinationData.updated_at
      }
    };
  } catch (error: any) {
    console.error('Error fetching destination:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch destination'
    });
  }
});
