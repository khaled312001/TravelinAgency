import { defineEventHandler, readBody } from 'h3';
import { executeQuery } from '~/utils/database';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { notificationId, type } = body;

    if (!notificationId || !type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notification ID and type are required'
      });
    }

    console.log(`📖 Marking notification as read: ${notificationId} (${type})`);

    let tableName = '';
    switch (type) {
      case 'contact':
        tableName = 'contact_messages';
        break;
      case 'package':
        tableName = 'package_inquiries';
        break;
      case 'destination':
        tableName = 'destination_inquiries';
        break;
      case 'booking':
        tableName = 'bookings';
        break;
      default:
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid notification type'
        });
    }

    // Mark notification as read
    await executeQuery(`
      UPDATE ${tableName} 
      SET is_read = 1, updated_at = NOW()
      WHERE id = ?
    `, [notificationId]);

    return {
      success: true,
      message: 'Notification marked as read'
    };

  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark notification as read'
    });
  }
});
