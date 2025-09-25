import { defineEventHandler, readBody } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/packages - Create new package
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.price || !body.duration_days) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: title_ar, title_en, price, duration_days'
      });
    }

    // Prepare package data
    const packageData = {
      title_ar: body.title_ar,
      title_en: body.title_en,
      description_ar: body.description_ar || '',
      description_en: body.description_en || '',
      price: parseFloat(body.price),
      duration_days: parseInt(body.duration_days),
      travel_period: body.travel_period || '',
      max_persons: parseInt(body.max_persons) || 10,
      category: body.category || 'domestic',
      active: body.status === 'active' ? 1 : 0,
      featured: body.featured ? 1 : 0,
      image_url: body.image_url || '',
      features: JSON.stringify(body.features || []),
      itinerary: JSON.stringify(body.itinerary || []),
      included: JSON.stringify(body.included || []),
      excluded: JSON.stringify(body.excluded || [])
    };

    // Insert package into database
    const result = await executeQuery(`
      INSERT INTO packages (
        title_ar, title_en, description_ar, description_en, price, 
        duration_days, travel_period, max_persons, category, active, 
        featured, image_url, features, itinerary, included, excluded
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      packageData.title_ar,
      packageData.title_en,
      packageData.description_ar,
      packageData.description_en,
      packageData.price,
      packageData.duration_days,
      packageData.travel_period,
      packageData.max_persons,
      packageData.category,
      packageData.active,
      packageData.featured,
      packageData.image_url,
      packageData.features,
      packageData.itinerary,
      packageData.included,
      packageData.excluded
    ]);

    if (!result || !result.insertId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create package'
      });
    }

    // Get the created package
    const createdPackage = await executeQuery(`
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
    `, [result.insertId]);

    if (!createdPackage || createdPackage.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve created package'
      });
    }

    const packageData_result = createdPackage[0];

    // Format the response
    const formattedPackage = {
      id: packageData_result.id,
      image_url: packageData_result.image,
      image: packageData_result.image,
      title_ar: packageData_result.title_ar,
      title_en: packageData_result.title_en,
      title: packageData_result.title_ar || packageData_result.title_en,
      description_ar: packageData_result.description_ar,
      description_en: packageData_result.description_en,
      description: packageData_result.description_ar || packageData_result.description_en,
      travel_period: packageData_result.location,
      duration_days: packageData_result.duration,
      price: packageData_result.price,
      max_persons: packageData_result.max_persons || 10,
      category: packageData_result.category || 'domestic',
      featured: packageData_result.featured,
      location: packageData_result.location,
      status: packageData_result.status === 1 ? 'active' : 'inactive',
      features: JSON.parse(packageData_result.features || '[]'),
      itinerary: JSON.parse(packageData_result.itinerary || '[]'),
      included: JSON.parse(packageData_result.included || '[]'),
      excluded: JSON.parse(packageData_result.excluded || '[]'),
      created_at: packageData_result.created_at,
      updated_at: packageData_result.updated_at
    };

    return {
      success: true,
      message: 'Package created successfully',
      package: formattedPackage
    };

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
