import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

export default defineEventHandler(async (event) => {
  try {
    console.log('🔔 Fetching admin notifications...');
    
    // Get unread contact messages
    const contactMessages = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        phone,
        message,
        'contact' as type,
        'رسالة تواصل جديدة' as title,
        'تم إرسال رسالة تواصل جديدة من العميل' as description,
        created_at,
        is_read
      FROM contact_messages 
      WHERE is_read = 0
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get recent package inquiries
    const packageInquiries = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        phone,
        message,
        package_name,
        'package' as type,
        'استفسار عن باقة جديدة' as title,
        CONCAT('استفسار جديد عن باقة: ', package_name) as description,
        created_at,
        is_read
      FROM package_inquiries 
      WHERE is_read = 0
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get recent destination inquiries
    const destinationInquiries = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        phone,
        message,
        destination_name,
        'destination' as type,
        'استفسار عن وجهة جديدة' as title,
        CONCAT('استفسار جديد عن وجهة: ', destination_name) as description,
        created_at,
        is_read
      FROM destination_inquiries 
      WHERE is_read = 0
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get recent bookings
    const bookings = await executeQuery(`
      SELECT 
        id,
        customer_name as name,
        customer_email as email,
        customer_phone as phone,
        'حجز جديد' as message,
        package_name,
        'booking' as type,
        'حجز جديد' as title,
        CONCAT('حجز جديد للباقة: ', package_name) as description,
        created_at,
        is_read
      FROM bookings 
      WHERE is_read = 0
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Combine all notifications
    const allNotifications = [
      ...contactMessages,
      ...packageInquiries,
      ...destinationInquiries,
      ...bookings
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Get total unread count
    const totalUnread = allNotifications.filter(n => !n.is_read).length;

    return {
      success: true,
      data: {
        notifications: allNotifications.slice(0, 20), // Limit to 20 most recent
        totalUnread,
        counts: {
          contact: contactMessages.length,
          package: packageInquiries.length,
          destination: destinationInquiries.length,
          booking: bookings.length
        }
      }
    };

  } catch (error) {
    console.error('❌ Error fetching admin notifications:', error);
    
    // Return empty notifications if there's an error
    return {
      success: true,
      data: {
        notifications: [],
        totalUnread: 0,
        counts: {
          contact: 0,
          package: 0,
          destination: 0,
          booking: 0
        }
      }
    };
  }
});
