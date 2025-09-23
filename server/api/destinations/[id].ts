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
        name,
        name_ar,
        name_en,
        description,
        description_ar,
        description_en,
        country,
        city,
        region,
        type,
        status,
        image,
        images,
        features,
        best_time_to_visit,
        average_temperature,
        local_language,
        local_currency,
        is_featured,
        seo_title,
        seo_description,
        seo_keywords,
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
        name: destinationData.name || destinationData.name_ar || destinationData.name_en,
        name_ar: destinationData.name_ar,
        name_en: destinationData.name_en,
        description: destinationData.description || destinationData.description_ar || destinationData.description_en,
        description_ar: destinationData.description_ar,
        description_en: destinationData.description_en,
        country: destinationData.country,
        city: destinationData.city,
        region: destinationData.region,
        type: destinationData.type,
        status: destinationData.status,
        image: destinationData.image,
        image_url: destinationData.image,
        images: JSON.parse(destinationData.images || '[]'),
        features: JSON.parse(destinationData.features || '[]'),
        best_time_to_visit: destinationData.best_time_to_visit,
        average_temperature: destinationData.average_temperature,
        local_language: destinationData.local_language,
        local_currency: destinationData.local_currency,
        is_featured: destinationData.is_featured,
        seo_title: destinationData.seo_title,
        seo_description: destinationData.seo_description,
        seo_keywords: destinationData.seo_keywords,
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
