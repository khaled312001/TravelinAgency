import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/packages - Get all packages
export default defineEventHandler(async (event) => {
  try {
    // Try to get packages from database first
    try {
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
          featured,
          active as status,
          created_at,
          updated_at
        FROM packages 
        ORDER BY created_at DESC
      `);
      
      if (packages && packages.length > 0) {
        // Format database packages data
        const formattedPackages = packages.map(packageData => ({
          id: packageData.id,
          title: packageData.title_ar || packageData.title_en,
          title_ar: packageData.title_ar,
          title_en: packageData.title_en,
          description: packageData.description_ar || packageData.description_en,
          description_ar: packageData.description_ar,
          description_en: packageData.description_en,
          price: packageData.price,
          duration: `${packageData.duration} days`,
          duration_days: packageData.duration,
          image: packageData.image,
          image_url: packageData.image,
          destination: packageData.location,
          location: packageData.location,
          travel_period: packageData.location,
          max_persons: packageData.max_persons || 10,
          category: 'international',
          featured: packageData.featured,
          status: packageData.status === 1 ? 'active' : 'inactive',
          features: [],
          itinerary: [],
          included: [],
          excluded: [],
          created_at: packageData.created_at,
          updated_at: packageData.updated_at
        }));

        return {
          success: true,
          message: 'Packages retrieved successfully from database',
          data: formattedPackages
        };
      }
    } catch (dbError) {
      console.log('Database packages not available, trying local data...');
    }
    
    // Fallback to local JSON file
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const localPackagesPath = path.join(process.cwd(), 'public', 'packages-with-local-images.json');
      const localPackagesData = fs.readFileSync(localPackagesPath, 'utf8');
      const localPackages = JSON.parse(localPackagesData);
      
      if (localPackages && Array.isArray(localPackages) && localPackages.length > 0) {
        // Format local packages data
        const formattedPackages = localPackages.map(packageData => ({
          id: packageData.id,
          title: packageData.title,
          title_ar: packageData.title,
          title_en: packageData.title,
          description: packageData.description,
          description_ar: packageData.description,
          description_en: packageData.description,
          price: packageData.price,
          duration: packageData.duration,
          duration_days: 7,
          image: packageData.image,
          image_url: packageData.image,
          destination: packageData.destination,
          location: packageData.destination,
          travel_period: packageData.destination,
          max_persons: 10,
          category: 'international',
          featured: packageData.featured,
          status: packageData.status,
          features: [],
          itinerary: [],
          included: [],
          excluded: [],
          created_at: packageData.created_at,
          updated_at: packageData.updated_at
        }));

        return {
          success: true,
          message: 'Packages retrieved successfully from local data',
          data: formattedPackages
        };
      }
    } catch (localError) {
      console.log('Local packages not available');
    }

    // If no data found from both database and local file
    return {
      success: false,
      message: 'No packages found',
      data: []
    };

  } catch (error: any) {
    console.error('Error fetching packages:', error);
    
    // Return a more detailed error response
    return {
      success: false,
      message: 'Failed to fetch packages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: []
    };
  }
});