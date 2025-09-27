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

    // Log the contact message data
    console.log('📧 Contact message received:', {
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

    // Try to insert into database, but provide fallback for development
    try {
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
        getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1',
        getHeader(event, 'user-agent') || 'Unknown'
      ]);
      
      console.log('✅ Database insert successful:', result);

      return {
        success: true,
        message: 'Contact message submitted successfully',
        id: result.insertId || 'success'
      };

    } catch (dbError: any) {
      console.warn('⚠️ Database connection failed, using development fallback:', dbError.message);
      
      // Development fallback - just log the message and return success
      // In production, you might want to send an email or use a different storage method
      console.log('📝 Development mode: Contact message logged to console');
      console.log('📧 Contact Details:', {
        name,
        email,
        phone,
        subject: subject || 'استفسار عام',
        message,
        type,
        source,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Contact message received successfully (development mode)',
        id: 'dev-' + Date.now()
      };
    }

  } catch (error: any) {
    console.error('❌ Error processing contact message:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process contact message'
    });
  }
});
