import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

export default defineEventHandler(async (event) => {
  try {
    console.log('📖 Marking all notifications as read...');

    // Mark all contact messages as read
    await executeQuery(`
      UPDATE contact_messages 
      SET is_read = 1, updated_at = NOW()
      WHERE is_read = 0
    `);

    // Mark all package inquiries as read
    await executeQuery(`
      UPDATE package_inquiries 
      SET is_read = 1, updated_at = NOW()
      WHERE is_read = 0
    `);

    // Mark all destination inquiries as read
    await executeQuery(`
      UPDATE destination_inquiries 
      SET is_read = 1, updated_at = NOW()
      WHERE is_read = 0
    `);

    // Mark all bookings as read
    await executeQuery(`
      UPDATE bookings 
      SET is_read = 1, updated_at = NOW()
      WHERE is_read = 0
    `);

    return {
      success: true,
      message: 'All notifications marked as read'
    };

  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark all notifications as read'
    });
  }
});
