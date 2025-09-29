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

    console.log(`Package ${packageId} update requested:`, body);

    // Try to update in database first
    try {
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
          updated_at = CURRENT_TIMESTAMP
        WHERE numeric_id = ? OR id = ?
      `, [
        body.title_ar || body.title,
        body.title_en || body.title,
        body.description_ar || body.description,
        body.description_en || body.description,
        body.price || 0,
        body.duration_days || 7,
        body.travel_period || body.location || '',
        body.max_persons || 10,
        body.image_url || '',
        body.featured ? 1 : 0,
        body.status === 'active' ? 1 : 0,
        packageId,
        packageId
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Package not found in database');
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
          featured,
          active as status,
          created_at,
          updated_at
        FROM packages 
        WHERE numeric_id = ? OR id = ?
      `, [packageId, packageId]);

      if (!updatedPackages || updatedPackages.length === 0) {
        throw new Error('Failed to retrieve updated package');
      }

      const packageData = updatedPackages[0];

      return {
        success: true,
        message: 'Package updated successfully in database',
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

    } catch (dbError) {
      console.log('Database update failed:', dbError);
      
      // Fallback to local file update
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const localPackagesPath = path.join(process.cwd(), 'public', 'packages-with-local-images.json');
        const localPackagesData = fs.readFileSync(localPackagesPath, 'utf8');
        const localPackages = JSON.parse(localPackagesData);
        
        const localPackage = localPackages.find((p: any) => p.id === parseInt(packageId));
        
        if (localPackage) {
          // Update the local package data
          const updatedPackage = {
            ...localPackage,
            title: body.title_ar || body.title || localPackage.title,
            description: body.description_ar || body.description || localPackage.description,
            price: body.price || localPackage.price,
            duration: body.duration || localPackage.duration,
            destination: body.travel_period || body.location || localPackage.destination,
            featured: body.featured !== undefined ? body.featured : localPackage.featured,
            status: body.status || localPackage.status,
            updated_at: new Date().toISOString()
          };

          // Update the package in the array
          const packageIndex = localPackages.findIndex((p: any) => p.id === parseInt(packageId));
          if (packageIndex !== -1) {
            localPackages[packageIndex] = updatedPackage;
            
            // Write back to file
            fs.writeFileSync(localPackagesPath, JSON.stringify(localPackages, null, 2));
          }

          return {
            success: true,
            message: 'Package updated successfully in local data (database unavailable)',
            package: {
              id: updatedPackage.id,
              title: updatedPackage.title,
              title_ar: updatedPackage.title,
              title_en: updatedPackage.title,
              description: updatedPackage.description,
              description_ar: updatedPackage.description,
              description_en: updatedPackage.description,
              price: updatedPackage.price,
              duration: updatedPackage.duration,
              duration_days: 7,
              image: updatedPackage.image,
              image_url: updatedPackage.image,
              destination: updatedPackage.destination,
              location: updatedPackage.destination,
              travel_period: updatedPackage.destination,
              max_persons: 10,
              category: 'international',
              featured: updatedPackage.featured,
              status: updatedPackage.status,
              features: [],
              itinerary: [],
              included: [],
              excluded: [],
              created_at: updatedPackage.created_at,
              updated_at: updatedPackage.updated_at
            }
          };
        }
      } catch (localError) {
        console.log('Local package update also failed:', localError);
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update package in both database and local storage'
      });
    }

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