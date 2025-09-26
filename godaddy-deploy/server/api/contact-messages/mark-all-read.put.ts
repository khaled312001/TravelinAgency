import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/contact-messages/mark-all-read - Mark all messages as read
export default defineEventHandler(async (event) => {
  try {
    console.log('Marking all messages as read...');
    
    const result = await executeQuery(`
      UPDATE contact_messages 
      SET status = 'read', updated_at = NOW()
      WHERE status = 'new'
    `);
    
    console.log('Database update result:', result);

    return {
      success: true,
      message: 'All messages marked as read successfully',
      affectedRows: result.affectedRows
    };

  } catch (error: any) {
    console.error('Error marking all messages as read:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark all messages as read'
    });
  }
});
