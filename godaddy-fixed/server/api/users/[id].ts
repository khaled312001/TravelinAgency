import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/users/[id] - Get single user
export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    // Get user from MySQL database
    const users = await executeQuery(`
      SELECT 
        id,
        email,
        full_name,
        phone,
        role,
        status,
        email_verified,
        phone_verified,
        bio,
        date_of_birth,
        gender,
        nationality,
        address,
        city,
        country,
        postal_code,
        preferences,
        created_at,
        updated_at,
        last_login,
        login_count
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (!users || users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    const userData = users[0];

    // Format to match expected structure
    return {
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        email_verified: userData.email_verified,
        phone_verified: userData.phone_verified,
        bio: userData.bio,
        date_of_birth: userData.date_of_birth,
        gender: userData.gender,
        nationality: userData.nationality,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postal_code: userData.postal_code,
        preferences: JSON.parse(userData.preferences || '{}'),
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        login_count: userData.login_count
      }
    };
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user'
    });
  }
});
