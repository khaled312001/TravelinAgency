import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/packages/[id] - Update package
export default defineEventHandler(async (event) => {
  try {
    const packageId = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!packageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Package ID is required'
      });
    }

    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.description_ar || !body.description_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and description in both languages are required'
      });
    }

    // Update package in MySQL database
    const result = await executeQuery(`
      UPDATE packages SET
        title_ar = ?,
        title_en = ?,
        description_ar = ?,
        description_en = ?,
        price = ?,
        duration_days = ?,
        travel_period = ?,
        max_persons = ?,
        image_url = ?,
        featured = ?,
        active = ?,
        features = ?,
        itinerary = ?,
        included = ?,
        excluded = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
      body.status === 'active' ? 1 : 0,
      JSON.stringify(body.features || []),
      JSON.stringify(body.itinerary || []),
      JSON.stringify(body.included || []),
      JSON.stringify(body.excluded || []),
      packageId
    ]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Package not found'
      });
    }

    // Get the updated package
    const updatedPackages = await executeQuery(`
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
        max_persons,
        category,
        featured,
        active as status,
        features,
        itinerary,
        included,
        excluded,
        created_at,
        updated_at
      FROM packages 
      WHERE id = ?
    `, [packageId]);

    if (!updatedPackages || updatedPackages.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve updated package'
      });
    }

    const packageData = updatedPackages[0];

    // Format the response
    return {
      success: true,
      message: 'Package updated successfully',
      package: {
        id: packageData.id,
        image_url: packageData.image,
        image: packageData.image,
        title_ar: packageData.title_ar,
        title_en: packageData.title_en,
        title: packageData.title_ar || packageData.title_en,
        description_ar: packageData.description_ar,
        description_en: packageData.description_en,
        description: packageData.description_ar || packageData.description_en,
        travel_period: packageData.location || `${packageData.duration} أيام`,
        duration_days: packageData.duration,
        price: packageData.price,
        max_persons: packageData.max_persons || 10,
        featured: packageData.featured,
        location: packageData.location,
        category: packageData.category || 'international',
        status: packageData.status === 1 ? 'active' : 'inactive',
        features: JSON.parse(packageData.features || '[]'),
        itinerary: JSON.parse(packageData.itinerary || '[]'),
        included: JSON.parse(packageData.included || '[]'),
        excluded: JSON.parse(packageData.excluded || '[]'),
        created_at: packageData.created_at,
        updated_at: packageData.updated_at
      }
    };

  } catch (error: any) {
    console.error('Error updating package:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update package'
    });
  }
});