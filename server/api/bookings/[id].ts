import { defineEventHandler, getRouterParam, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/bookings/[id] - Get single booking
export default defineEventHandler(async (event) => {
  try {
    const bookingId = getRouterParam(event, 'id');
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      });
    }

    // Get booking from MySQL database with package information
    const bookings = await executeQuery(`
      SELECT 
        b.id, 
        b.booking_number,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.customer_details,
        b.guests_count,
        b.guests_details,
        b.departure_date,
        b.return_date,
        b.total_amount,
        b.paid_amount,
        b.currency,
        b.payment_status,
        b.booking_status,
        b.payment_method,
        b.payment_reference,
        b.special_requests,
        b.notes,
        b.cancellation_reason,
        b.cancellation_date,
        b.confirmed_at,
        b.created_at,
        b.updated_at,
        p.id as package_id,
        p.title_ar as package_title_ar,
        p.title_en as package_title_en,
        p.title as package_title,
        p.price as package_price,
        p.duration_days as package_duration,
        p.travel_period as package_location,
        p.image_url as package_image
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.id = ?
    `, [bookingId]);

    if (!bookings || bookings.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      });
    }

    const bookingData = bookings[0];

    // Format to match expected structure
    return {
      success: true,
      data: {
        id: bookingData.id,
        booking_number: bookingData.booking_number,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone,
        customer_details: JSON.parse(bookingData.customer_details || '{}'),
        guests_count: bookingData.guests_count,
        guests_details: JSON.parse(bookingData.guests_details || '[]'),
        departure_date: bookingData.departure_date,
        return_date: bookingData.return_date,
        total_amount: bookingData.total_amount,
        paid_amount: bookingData.paid_amount,
        currency: bookingData.currency,
        payment_status: bookingData.payment_status,
        booking_status: bookingData.booking_status,
        payment_method: bookingData.payment_method,
        payment_reference: bookingData.payment_reference,
        special_requests: bookingData.special_requests,
        notes: bookingData.notes,
        cancellation_reason: bookingData.cancellation_reason,
        cancellation_date: bookingData.cancellation_date,
        confirmed_at: bookingData.confirmed_at,
        created_at: bookingData.created_at,
        updated_at: bookingData.updated_at,
        package: {
          id: bookingData.package_id,
          title_ar: bookingData.package_title_ar,
          title_en: bookingData.package_title_en,
          title: bookingData.package_title_ar || bookingData.package_title_en || bookingData.package_title,
          price: bookingData.package_price,
          duration_days: bookingData.package_duration,
          location: bookingData.package_location,
          travel_period: bookingData.package_location,
          image_url: bookingData.package_image
        }
      }
    };
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch booking'
    });
  }
});
