import { defineEventHandler, readBody, getRequestIP, getHeader } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/contact-messages - Create new contact message
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const {
      name,
      email,
      phone,
      subject,
      message,
      type = 'general',
      source = 'website',
      related_package_id = null,
      related_destination_id = null
    } = body;

    // Validate required fields
    if (!name || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and message are required'
      });
    }

    // Insert contact message into database
    console.log('Inserting contact message with data:', {
      name,
      email: email || null,
      phone: phone || null,
      subject: subject || 'استفسار عام',
      message,
      type,
      source,
      related_package_id,
      related_destination_id
    });
    
    const result = await executeQuery(`
      INSERT INTO contact_messages (
        name, email, phone, subject, message, type, status, source,
        related_package_id, related_destination_id, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      name,
      email || null,
      phone || null,
      subject || 'استفسار عام',
      message,
      type,
      'new',
      source,
      related_package_id,
      related_destination_id,
      '127.0.0.1', // getRequestIP(event, { xForwardedFor: true }),
      'Test User Agent' // getHeader(event, 'user-agent')
    ]);
    
    console.log('Database result:', result);

    if (!result || result.affectedRows === 0) {
      console.error('Database insert failed:', result);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save contact message'
      });
    }

    return {
      success: true,
      message: 'Contact message submitted successfully',
      id: result.affectedRows > 0 ? 'success' : null
    };

  } catch (error: any) {
    console.error('Error creating contact message:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process contact message'
    });
  }
});
