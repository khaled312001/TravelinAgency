import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// DELETE /api/destinations/[id] - Delete destination
export default defineEventHandler(async (event) => {
  try {
    const destinationId = getRouterParam(event, 'id');
    
    if (!destinationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      });
    }

    // Check if destination exists
    const existingDestinations = await executeQuery(`
      SELECT id FROM destinations WHERE id = ?
    `, [destinationId]);

    if (!existingDestinations || existingDestinations.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Destination not found'
      });
    }

    // Delete destination from MySQL database
    const result = await executeQuery(`
      DELETE FROM destinations WHERE id = ?
    `, [destinationId]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Destination not found'
      });
    }

    return {
      success: true,
      message: 'Destination deleted successfully'
    };

  } catch (error: any) {
    console.error('Error deleting destination:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete destination'
    });
  }
});
