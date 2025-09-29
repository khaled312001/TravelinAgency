import { defineEventHandler, getRouterParam, createError } from 'h3';
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

    // Try to get package from database first
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
        WHERE numeric_id = ? OR id = ?
      `, [packageId, packageId]);
      
      if (packages && packages.length > 0) {
        const packageData = packages[0];
        
        return {
          package: {
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
          }
        };
      }
    } catch (dbError) {
      console.log('Database package not available, trying local data...');
    }
    
    // Fallback to local JSON file
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const localPackagesPath = path.join(process.cwd(), 'public', 'packages-with-local-images.json');
      const localPackagesData = fs.readFileSync(localPackagesPath, 'utf8');
      const localPackages = JSON.parse(localPackagesData);
      
      const localPackage = localPackages.find((p: any) => p.id === parseInt(packageId));
      
      if (localPackage) {
        // Format local package data
        return {
          package: {
            id: localPackage.id,
            title: localPackage.title,
            title_ar: localPackage.title,
            title_en: localPackage.title,
            description: localPackage.description,
            description_ar: localPackage.description,
            description_en: localPackage.description,
            price: localPackage.price,
            duration: localPackage.duration,
            duration_days: 7,
            image: localPackage.image,
            image_url: localPackage.image,
            destination: localPackage.destination,
            location: localPackage.destination,
            travel_period: localPackage.destination,
            max_persons: 10,
            category: 'international',
            featured: localPackage.featured,
            status: localPackage.status,
            features: [],
            itinerary: [],
            included: [],
            excluded: [],
            created_at: localPackage.created_at,
            updated_at: localPackage.updated_at
          }
        };
      }
    } catch (localError) {
      console.log('Local package not available');
    }

    // Package not found
    throw createError({
      statusCode: 404,
      statusMessage: 'Package not found'
    });

  } catch (error: any) {
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