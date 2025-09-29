import { defineEventHandler, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/packages - Create new package
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.description_ar || !body.description_en) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and description in both languages are required'
      });
    }

    // Try to insert into database first
    try {
      // Generate a new numeric_id for the package
      const maxIdResult = await executeQuery('SELECT MAX(numeric_id) as max_id FROM packages');
      const newNumericId = (maxIdResult[0]?.max_id || 0) + 1;

      const result = await executeQuery(`
        INSERT INTO packages (
          numeric_id,
          title_ar,
          title_en,
          description_ar,
          description_en,
          price,
          duration_days,
          travel_period,
          max_persons,
          image_url,
          featured,
          active,
          features,
          itinerary,
          included,
          excluded,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        newNumericId,
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
        JSON.stringify(body.excluded || [])
      ]);

      // Get the created package using the numeric_id
      const newPackages = await executeQuery(`
        SELECT 
          id, 
          numeric_id,
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
          features,
          itinerary,
          included,
          excluded,
          created_at,
          updated_at
        FROM packages 
        WHERE numeric_id = ?
      `, [newNumericId]);

      if (!newPackages || newPackages.length === 0) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve created package'
        });
      }

      const packageData = newPackages[0];

      // Format the response
      return {
        success: true,
        message: 'Package created successfully',
        package: {
          id: packageData.numeric_id, // Return numeric_id for frontend compatibility
          uuid: packageData.id, // Keep UUID for reference
          image_url: packageData.image,
          image: packageData.image,
          title_ar: packageData.title_ar,
          title_en: packageData.title_en,
          description_ar: packageData.description_ar,
          description_en: packageData.description_en,
          description: packageData.description_ar || packageData.description_en,
          travel_period: packageData.location || `${packageData.duration} أيام`,
          duration_days: packageData.duration,
          price: packageData.price,
          max_persons: packageData.max_persons || 10,
          featured: packageData.featured,
          location: packageData.location,
          category: 'international',
          status: packageData.status === 1 ? 'active' : 'inactive',
          features: JSON.parse(packageData.features || '[]'),
          itinerary: JSON.parse(packageData.itinerary || '[]'),
          included: JSON.parse(packageData.included || '[]'),
          excluded: JSON.parse(packageData.excluded || '[]'),
          created_at: packageData.created_at,
          updated_at: packageData.updated_at
        }
      };

    } catch (dbError) {
      console.log('Database insert failed:', dbError);
      
      // Fallback: Update local JSON file
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const localPackagesPath = path.join(process.cwd(), 'public', 'packages-with-local-images.json');
        const localPackagesData = fs.readFileSync(localPackagesPath, 'utf8');
        const localPackages = JSON.parse(localPackagesData);
        
        // Generate new ID
        const newId = Math.max(...localPackages.map((p: any) => p.id)) + 1;
        
        const newPackage = {
          id: newId,
          title: body.title_ar || body.title_en,
          description: body.description_ar || body.description_en,
          price: body.price || 0,
          duration: `${body.duration_days || 1} days`,
          image: body.image_url || '/images/placeholder.svg',
          destination: body.travel_period || '',
          featured: body.featured || false,
          status: body.status || 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localPackages.push(newPackage);
        
        // Write back to file
        fs.writeFileSync(localPackagesPath, JSON.stringify(localPackages, null, 2));
        
        return {
          success: true,
          message: 'Package created successfully in local data',
          package: {
            id: newPackage.id,
            title: newPackage.title,
            title_ar: newPackage.title,
            title_en: newPackage.title,
            description: newPackage.description,
            description_ar: newPackage.description,
            description_en: newPackage.description,
            price: newPackage.price,
            duration: newPackage.duration,
            duration_days: body.duration_days || 1,
            image: newPackage.image,
            image_url: newPackage.image,
            destination: newPackage.destination,
            location: newPackage.destination,
            travel_period: newPackage.destination,
            max_persons: body.max_persons || 10,
            category: 'international',
            featured: newPackage.featured,
            status: newPackage.status,
            features: body.features || [],
            itinerary: body.itinerary || [],
            included: body.included || [],
            excluded: body.excluded || [],
            created_at: newPackage.created_at,
            updated_at: newPackage.updated_at
          }
        };
        
      } catch (localError) {
        console.log('Local file update failed:', localError);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to create package in both database and local storage'
        });
      }
    }

  } catch (error: any) {
    console.error('Error creating package:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create package'
    });
  }
});