import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/bookings - Get all bookings
export default defineEventHandler(async (event) => {
  try {
    // Get bookings from MySQL database with package information
    const bookings = await executeQuery(`
      SELECT 
        b.id, 
        b.booking_number,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        p.title_ar as package_title,
        b.departure_date as travel_date,
        b.return_date,
        b.guests_count,
        b.booking_status as status,
        b.payment_status,
        b.total_amount,
        b.paid_amount,
        b.currency,
        b.special_requests,
        b.notes,
        b.created_at,
        b.updated_at
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC
    `);

    // Format to match expected structure
    return {
      success: true,
      bookings: bookings.map(booking => ({
        id: booking.id,
        booking_number: booking.booking_number,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        package_title: booking.package_title || 'حزمة غير محددة',
        travel_date: booking.travel_date,
        return_date: booking.return_date,
        adults: booking.guests_count || 1,
        children: 0, // Not separated in current structure
        status: booking.status || 'pending',
        payment_status: booking.payment_status || 'pending',
        total_amount: booking.total_amount || 0,
        paid_amount: booking.paid_amount || 0,
        currency: booking.currency || 'SAR',
        special_requests: booking.special_requests,
        notes: booking.notes,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      }))
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { error: 'Failed to fetch bookings' };
  }
});
