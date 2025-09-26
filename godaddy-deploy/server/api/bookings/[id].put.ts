import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// PUT /api/bookings/[id] - Update booking
export default defineEventHandler(async (event) => {
  try {
    const bookingId = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      });
    }

    // Validate required fields
    if (!body.customer_name || !body.customer_email || !body.customer_phone || !body.package_id || !body.departure_date || !body.total_amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Customer name, email, phone, package, departure date, and total amount are required'
      });
    }

    // Update booking in MySQL database
    const result = await executeQuery(`
      UPDATE bookings SET
        package_id = ?,
        customer_name = ?,
        customer_email = ?,
        customer_phone = ?,
        customer_details = ?,
        guests_count = ?,
        guests_details = ?,
        departure_date = ?,
        return_date = ?,
        total_amount = ?,
        paid_amount = ?,
        currency = ?,
        payment_status = ?,
        booking_status = ?,
        payment_method = ?,
        payment_reference = ?,
        special_requests = ?,
        notes = ?,
        cancellation_reason = ?,
        cancellation_date = ?,
        confirmed_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.package_id,
      body.customer_name,
      body.customer_email,
      body.customer_phone,
      JSON.stringify(body.customer_details || {}),
      body.guests_count || 1,
      JSON.stringify(body.guests_details || []),
      body.departure_date,
      body.return_date || null,
      body.total_amount,
      body.paid_amount || 0,
      body.currency || 'SAR',
      body.payment_status || 'pending',
      body.booking_status || 'pending',
      body.payment_method || null,
      body.payment_reference || null,
      body.special_requests || null,
      body.notes || null,
      body.cancellation_reason || null,
      body.cancellation_date || null,
      body.confirmed_at || null,
      bookingId
    ]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      });
    }

    // Get the updated booking with package information
    const updatedBookings = await executeQuery(`
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

    if (!updatedBookings || updatedBookings.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve updated booking'
      });
    }

    const bookingData = updatedBookings[0];

    // Format the response
    return {
      success: true,
      message: 'Booking updated successfully',
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
    console.error('Error updating booking:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update booking'
    });
  }
});
