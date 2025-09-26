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
        subject,
        message,
        type,
        status,
        source,
        related_package_id,
        related_destination_id,
        ip_address,
        user_agent,
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
        subject: msg.subject,
        message: msg.message,
        type: msg.type || 'general',
        status: msg.status || 'new',
        source: msg.source || 'website',
        related_package_id: msg.related_package_id,
        related_destination_id: msg.related_destination_id,
        is_read: msg.status === 'read' ? 1 : 0,
        created_at: msg.created_at,
        updated_at: msg.updated_at
      }))
    };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { error: 'Failed to fetch contact messages' };
  }
});
