import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/packages
export default defineEventHandler(async (event) => {
  try {
    // Get packages from MySQL database
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
        featured,
        active as status,
        created_at
      FROM packages 
      WHERE active = 1
      ORDER BY created_at DESC
    `);

    // Format to match expected structure
    return {
      success: true,
      data: packages.map(pkg => ({
        id: pkg.id,
        image_url: pkg.image,
        image: pkg.image, // Keep both for compatibility
        title_ar: pkg.title_ar,
        title_en: pkg.title_en,
        title: pkg.title_ar || pkg.title_en, // Fallback for compatibility
        description_ar: pkg.description_ar,
        description_en: pkg.description_en,
        description: pkg.description_ar || pkg.description_en, // Fallback for compatibility
        travel_period: pkg.location || `${pkg.duration} أيام`,
        duration_days: pkg.duration,
        price: pkg.price,
        max_persons: 10, // Default value
        featured: pkg.featured,
        location: pkg.location,
        category: pkg.category || 'international', // Default category
        status: pkg.status === 1 ? 'active' : 'inactive',
        views: 0, // Default value
        created_at: pkg.created_at,
        // Add default included_options for PackageCard compatibility
        included_options: {
          flight: true,
          hotel: true,
          transportation: true,
          hotelGrade: 5 // Default 5-star hotel
        }
      }))
    };
  } catch (error) {
    console.error('Error fetching packages:', error);
    return { 
      success: false,
      error: 'Failed to fetch packages',
      data: []
    };
  }
});
