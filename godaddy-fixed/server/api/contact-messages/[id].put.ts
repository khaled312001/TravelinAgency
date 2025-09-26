import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/contact-messages/[id] - Update contact message status
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    const { is_read, status } = body;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message ID is required'
      });
    }

    // Update message status
    console.log('Updating message status:', { id, is_read, status });
    
    const result = await executeQuery(`
      UPDATE contact_messages 
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      status || 'read',
      id
    ]);
    
    console.log('Database update result:', result);

    if (!result || result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Message not found'
      });
    }

    return {
      success: true,
      message: 'Message status updated successfully'
    };

  } catch (error: any) {
    console.error('Error updating message status:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update message status'
    });
  }
});
