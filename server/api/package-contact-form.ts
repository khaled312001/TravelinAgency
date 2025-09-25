import { defineEventHandler, readBody, getRequestIP, getHeader } from 'h3';
import { executeQuery } from '~/utils/database';
import twilio from 'twilio';

// POST /api/package-contact-form - Handle package contact form submissions
export default defineEventHandler(async (event) => {
  try {
    const formData = await readBody(event);
    const config = useRuntimeConfig();
    
    const {
      name,
      email,
      phone,
      message,
      packageId,
      packageName,
      locale = 'ar-SA'
    } = formData;

    // Validate required fields
    if (!name || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and message are required'
      });
    }

    // Insert package inquiry into database
    console.log('Inserting package inquiry with data:', {
      name,
      email: email || null,
      phone: phone || null,
      message,
      packageId,
      packageName,
      locale
    });
    
    const result = await executeQuery(`
      INSERT INTO contact_messages (
        name, email, phone, subject, message, type, status, source,
        related_package_id, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      name,
      email || null,
      phone || null,
      `استفسار عن ${packageName}`,
      message,
      'booking',
      'new',
      'website',
      packageId || null,
      '127.0.0.1', // getRequestIP(event, { xForwardedFor: true }),
      'Test User Agent' // getHeader(event, 'user-agent')
    ]);
    
    console.log('Database result:', result);

    if (!result || result.affectedRows === 0) {
      console.error('Database insert failed:', result);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save package inquiry'
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
          ? `طلب حجز جديد!
          
    العميل: ${formData.name}
    البريد الإلكتروني: ${formData.email}
    الهاتف: ${formData.phone}
    الباقة: ${formData.packageName}
    الرسالة: ${formData.message}`
          : `New Package Inquiry!
          
    Customer: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Package: ${formData.packageName}
    Message: ${formData.message}`;

        const message = await client.messages.create({
          from: `whatsapp:${config.twilioPhoneNumber}`,
          to: `whatsapp:${config.salesManagerPhone}`,
          body: messageBody
        })

        notificationSent = true
        console.log('WhatsApp notification sent successfully:', message.sid)
      } catch (twilioError: any) {
        console.error('Twilio client error:', twilioError);
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
    console.error('Contact form submission failed:', err)
    return {
      success: false,
      error: err.message || 'Failed to process contact form',
      notificationSent: false
    }
  }
})