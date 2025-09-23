import { defineEventHandler, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/users - Create new user
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.email || !body.password || !body.full_name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, and full name are required'
      });
    }

    // Check if email already exists
    const existingUsers = await executeQuery(`
      SELECT id FROM users WHERE email = ?
    `, [body.email]);

    if (existingUsers && existingUsers.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already exists'
      });
    }

    // Create user in MySQL database
    const result = await executeQuery(`
      INSERT INTO users (
        email,
        password,
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
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      body.email,
      body.password, // In real app, this should be hashed
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
      JSON.stringify(body.preferences || {})
    ]);

    // Get the created user
    const createdUsers = await executeQuery(`
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
        updated_at
      FROM users 
      WHERE id = ?
    `, [result.insertId]);

    if (!createdUsers || createdUsers.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve created user'
      });
    }

    const userData = createdUsers[0];

    // Format the response
    return {
      success: true,
      message: 'User created successfully',
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
        updated_at: userData.updated_at
      }
    };

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    });
  }
});
