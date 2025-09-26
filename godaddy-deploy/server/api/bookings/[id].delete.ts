import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// DELETE /api/bookings/[id] - Delete booking
export default defineEventHandler(async (event) => {
  try {
    const bookingId = getRouterParam(event, 'id');
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      });
    }

    // Check if booking exists
    const existingBookings = await executeQuery(`
      SELECT id FROM bookings WHERE id = ?
    `, [bookingId]);

    if (!existingBookings || existingBookings.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      });
    }

    // Delete booking from MySQL database
    const result = await executeQuery(`
      DELETE FROM bookings WHERE id = ?
    `, [bookingId]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      });
    }

    return {
      success: true,
      message: 'Booking deleted successfully'
    };

  } catch (error: any) {
    console.error('Error deleting booking:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete booking'
    });
  }
});
