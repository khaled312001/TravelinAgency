import { defineEventHandler, readBody, getRequestIP, getHeader } from 'h3';
import { executeQuery } from '~/utils/database';
import twilio from 'twilio';

// POST /api/destination-contact-form - Handle destination contact form submissions
export default defineEventHandler(async (event) => {
  try {
    const formData = await readBody(event);
    const config = useRuntimeConfig();
    
    const {
      name,
      email,
      phone,
      message,
      destinationId,
      destinationName,
      locale = 'ar-SA'
    } = formData;

    // Validate required fields
    if (!name || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and message are required'
      });
    }

    // Insert destination inquiry into database
    console.log('Inserting destination inquiry with data:', {
      name,
      email: email || null,
      phone: phone || null,
      message,
      destinationId,
      destinationName,
      locale
    });
    
    const result = await executeQuery(`
      INSERT INTO contact_messages (
        name, email, phone, subject, message, type, status, source,
        related_destination_id, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      name,
      email || null,
      phone || null,
      `استفسار عن ${destinationName}`,
      message,
      'general',
      'new',
      'website',
      destinationId || null,
      '127.0.0.1', // getRequestIP(event, { xForwardedFor: true }),
      'Test User Agent' // getHeader(event, 'user-agent')
    ]);
    
    console.log('Database result:', result);

    if (!result || result.affectedRows === 0) {
      console.error('Database insert failed:', result);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save destination inquiry'
      });
    }

    // Initialize Twilio client (only if credentials are properly configured)
    let notificationSent = false
    if (config.twilioAccountSid && config.twilioAuthToken && 
        config.twilioAccountSid.startsWith('AC') && 
        config.twilioWhatsAppNumber) {
      try {
        const client = twilio(
          config.twilioAccountSid,
          config.twilioAuthToken
        )

        // Create a simple text message instead of using templates for now
        const messageBody = locale.startsWith('ar')
          ? `طلب استفسار عن وجهة سياحية جديد!
          
    العميل: ${formData.name}
    البريد الإلكتروني: ${formData.email}
    الهاتف: ${formData.phone}
    الوجهة: ${formData.destinationName}
    الرسالة: ${formData.message}`
          : `New Destination Inquiry!
          
    Customer: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Destination: ${formData.destinationName}
    Message: ${formData.message}`;

        const message = await client.messages.create({
          from: `whatsapp:${config.twilioPhoneNumber}`,
          to: `whatsapp:${config.salesManagerPhone}`,
          body: messageBody
        })

        notificationSent = true
        console.log('WhatsApp notification sent successfully:', message.sid)
      } catch (twilioError: any) {
        console.error('Twilio client error for destination inquiry:', twilioError);
        notificationSent = false
      }
    } else {
      console.log('Twilio not configured - skipping WhatsApp notification')
    }

    return {
      success: true,
      inquiryId: result.insertId || 0,
      notificationSent,
      ...(notificationSent ? { notificationId: 'sent' } : { error: 'Twilio not configured' })
    }
  } catch (err: any) {
    console.error('Destination contact form submission failed:', err)
    return {
      success: false,
      error: err.message || 'Failed to process destination contact form',
      notificationSent: false
    }
  }
})