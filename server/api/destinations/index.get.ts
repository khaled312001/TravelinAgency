import { defineEventHandler, getQuery } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/destinations - Get all destinations with filtering and pagination
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { 
      page = '1', 
      limit = '50', 
      type = '', 
      status = '', 
      featured = '', 
      search = '' 
    } = query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];

    if (type) {
      whereConditions.push('category = ?');
      queryParams.push(type);
    }

    if (status) {
      whereConditions.push('active = ?');
      queryParams.push(status === 'active' ? 1 : 0);
    }

    if (featured) {
      whereConditions.push('featured = ?');
      queryParams.push(featured === 'true' ? 1 : 0);
    }

    if (search) {
      whereConditions.push('(name_ar LIKE ? OR name_en LIKE ? OR description_ar LIKE ? OR description_en LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM destinations ${whereClause}`;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = countResult[0]?.total || 0;

    // Get destinations
    const destinationsQuery = `
      SELECT 
        id,
        name_ar,
        name_en,
        description_ar,
        description_en,
        image_url,
        featured,
        category,
        active,
        created_at,
        updated_at
      FROM destinations 
      ${whereClause}
      ORDER BY featured DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;

    const destinations = await executeQuery(destinationsQuery, [...queryParams, limitNum, offset]);

    // Format destinations
    const formattedDestinations = destinations.map(dest => ({
      id: dest.id,
      name: dest.name_ar || dest.name_en,
      name_ar: dest.name_ar,
      name_en: dest.name_en,
      description: dest.description_ar || dest.description_en,
      description_ar: dest.description_ar,
      description_en: dest.description_en,
      image: dest.image_url,
      image_url: dest.image_url,
      featured: dest.featured === 1,
      category: dest.category,
      active: dest.active === 1,
      status: dest.active === 1 ? 'active' : 'inactive',
      created_at: dest.created_at,
      updated_at: dest.updated_at
    }));

    return {
      success: true,
      data: formattedDestinations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };

  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch destinations'
    });
  }
});
