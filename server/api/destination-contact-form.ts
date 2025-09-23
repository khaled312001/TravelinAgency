import twilio from 'twilio'
import type { DestinationInquiry } from '~/types/whatsapp'
import { executeQuery, logActivity } from '~/utils/database'

export default defineEventHandler(async (event) => {
  const formData = await readBody(event) as DestinationInquiry
  const locale = formData.locale || 'en-US'

  try {
    // Store in MySQL database
    const result = await executeQuery(`
      INSERT INTO contact_messages (
        name, email, phone, subject, message, type, status, source, 
        related_destination_id, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      formData.name,
      formData.email,
      formData.phone,
      `Destination Inquiry: ${formData.destinationName}`,
      formData.message,
      'general',
      'new',
      'website',
      null, // related_destination_id - could be set if we have the ID
      getClientIP(event),
      getHeader(event, 'user-agent')
    ])

    if (!result) {
      console.error('Failed to save destination inquiry to database')
      return {
        success: false,
        error: 'Failed to save destination inquiry',
        notificationSent: false
      }
    }

    // Send WhatsApp notification
    try {
      const config = useRuntimeConfig()

      // Validate required Twilio configuration
      if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber || !config.salesManagerPhone) {
        console.error('Missing Twilio configuration for destination inquiry:', {
          twilioAccountSid: !config.twilioAccountSid ? 'missing' : 'present',
          twilioAuthToken: !config.twilioAuthToken ? 'missing' : 'present',
          twilioPhoneNumber: !config.twilioPhoneNumber ? 'missing' : 'present',
          salesManagerPhone: !config.salesManagerPhone ? 'missing' : 'present'
        });

        // Update the inquiry with error information
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: false,
            notification_error: 'Incomplete Twilio configuration'
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: false,
          error: 'Incomplete Twilio configuration'
        }
      }

      // Initialize Twilio client
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
    Message: ${formData.message}`

        // Send a simple WhatsApp message
        const message = await client.messages.create({
          from: `whatsapp:${config.twilioPhoneNumber}`,
          to: `whatsapp:${config.salesManagerPhone}`,
          body: messageBody
        })

        // Update Supabase with notification status
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: true,
            notification_id: message.sid
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: true,
          notificationId: message.sid
        }
      } catch (twilioError: any) {
        console.error('Twilio client error for destination inquiry:', twilioError);

        // Update Supabase with error information
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: false,
            notification_error: twilioError.message || 'Twilio error'
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: false,
          error: twilioError.message || 'Failed to send WhatsApp notification'
        }
      }
    } catch (err: any) {
      console.error('WhatsApp notification for destination inquiry failed:', err)

      // Update Supabase with error information
      await supabase
        .from('destination_inquiries')
        .update({
          notification_sent: false,
          notification_error: err.message || 'Unknown error'
        })
        .eq('id', data[0].id)

      return {
        success: true,
        inquiryId: data[0].id,
        notificationSent: false,
        error: err.message || 'Failed to send WhatsApp notification'
      }
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
