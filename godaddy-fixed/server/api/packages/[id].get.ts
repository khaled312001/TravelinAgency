import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/packages/[id] - Get single package
export default defineEventHandler(async (event) => {
  try {
    const packageId = getRouterParam(event, 'id');
    
    if (!packageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Package ID is required'
      });
    }

    // Get package from MySQL database
    const packages = await executeQuery(`
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

    if (!packages || packages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Package not found'
      });
    }

    const packageData = packages[0];

    // Format to match expected structure
    return {
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
        max_persons: packageData.max_persons || 10,
        category: packageData.category || 'domestic',
        featured: packageData.featured,
        location: packageData.location,
        status: packageData.status === 1 ? 'active' : 'inactive',
        features: JSON.parse(packageData.features || '[]'),
        itinerary: JSON.parse(packageData.itinerary || '[]'),
        included: JSON.parse(packageData.included || '[]'),
        excluded: JSON.parse(packageData.excluded || '[]'),
        created_at: packageData.created_at,
        updated_at: packageData.updated_at
      }
    };
  } catch (error) {
    console.error('Error fetching package:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch package'
    });
  }
});
