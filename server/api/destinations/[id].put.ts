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
    if (!body.name_ar || !body.name_en || !body.description_ar || !body.description_en || !body.country || !body.city) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, description, country, and city are required'
      });
    }

    // Update destination in MySQL database
    const result = await executeQuery(`
      UPDATE destinations SET
        name = ?,
        name_ar = ?,
        name_en = ?,
        description = ?,
        description_ar = ?,
        description_en = ?,
        country = ?,
        city = ?,
        region = ?,
        type = ?,
        status = ?,
        image = ?,
        images = ?,
        features = ?,
        best_time_to_visit = ?,
        average_temperature = ?,
        local_language = ?,
        local_currency = ?,
        is_featured = ?,
        seo_title = ?,
        seo_description = ?,
        seo_keywords = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.name_ar, // Use Arabic name as primary name
      body.name_ar,
      body.name_en,
      body.description_ar, // Use Arabic description as primary description
      body.description_ar,
      body.description_en,
      body.country,
      body.city,
      body.region || null,
      body.type || 'city',
      body.status || 'active',
      body.image_url || null,
      JSON.stringify(body.images || []),
      JSON.stringify(body.features || []),
      body.best_time_to_visit || null,
      body.average_temperature || null,
      body.local_language || null,
      body.local_currency || null,
      body.is_featured || 0,
      body.seo_title || null,
      body.seo_description || null,
      body.seo_keywords || null,
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
