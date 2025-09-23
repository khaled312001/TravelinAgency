import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/contact-messages - Get all contact messages
export default defineEventHandler(async (event) => {
  try {
    // Get contact messages from MySQL database
    const messages = await executeQuery(`
      SELECT 
        id, 
        name,
        email,
        phone,
        'general' as type,
        message,
        0 as is_read,
        created_at,
        updated_at
      FROM contact_messages 
      ORDER BY created_at DESC
    `);

    // Format to match expected structure
    return {
      messages: messages.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        type: msg.type,
        message: msg.message,
        is_read: msg.is_read,
        created_at: msg.created_at,
        updated_at: msg.updated_at
      }))
    };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { error: 'Failed to fetch contact messages' };
  }
});
