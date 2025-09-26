import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// DELETE /api/users/[id] - Delete user
export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    
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

    // Delete user from MySQL database
    const result = await executeQuery(`
      DELETE FROM users WHERE id = ?
    `, [userId]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };

  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    });
  }
});
