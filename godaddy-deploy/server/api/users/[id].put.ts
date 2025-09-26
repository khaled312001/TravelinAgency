import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/users/[id] - Update user
export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    // Check if user exists
    const existingUsers = await executeQuery(`
      SELECT id FROM users WHERE id = ?
    `, [userId]);

    if (!existingUsers || existingUsers.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    // Update user in MySQL database
    const result = await executeQuery(`
      UPDATE users SET
        email = ?,
        full_name = ?,
        phone = ?,
        role = ?,
        status = ?,
        email_verified = ?,
        phone_verified = ?,
        bio = ?,
        date_of_birth = ?,
        gender = ?,
        nationality = ?,
        address = ?,
        city = ?,
        country = ?,
        postal_code = ?,
        preferences = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.email,
      body.full_name,
      body.phone || null,
      body.role || 'user',
      body.status || 'active',
      body.email_verified || 0,
      body.phone_verified || 0,
      body.bio || null,
      body.date_of_birth || null,
      body.gender || null,
      body.nationality || null,
      body.address || null,
      body.city || null,
      body.country || null,
      body.postal_code || null,
      JSON.stringify(body.preferences || {}),
      userId
    ]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    // Get the updated user
    const updatedUsers = await executeQuery(`
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

    if (!updatedUsers || updatedUsers.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve updated user'
      });
    }

    const userData = updatedUsers[0];

    // Format the response
    return {
      success: true,
      message: 'User updated successfully',
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
    console.error('Error updating user:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user'
    });
  }
});
