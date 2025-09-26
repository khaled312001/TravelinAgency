import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// DELETE /api/packages/[id] - Delete package
export default defineEventHandler(async (event) => {
  try {
    const packageId = getRouterParam(event, 'id');
    
    if (!packageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Package ID is required'
      });
    }

    // Check if package exists
    const existingPackages = await executeQuery(`
      SELECT id FROM packages WHERE id = ?
    `, [packageId]);

    if (!existingPackages || existingPackages.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Package not found'
      });
    }

    // Delete package from MySQL database
    await executeQuery(`
      DELETE FROM packages WHERE id = ?
    `, [packageId]);

    return {
      success: true,
      message: 'Package deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting package:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete package'
    });
  }
});
