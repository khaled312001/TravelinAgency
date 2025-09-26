import { defineEventHandler, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/bookings - Create new booking
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.customer_name || !body.customer_email || !body.customer_phone || !body.package_id || !body.departure_date || !body.total_amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Customer name, email, phone, package, departure date, and total amount are required'
      });
    }

    // Generate booking number if not provided
    const bookingNumber = body.booking_number || `BK${Date.now()}`;

    // Create booking in MySQL database
    const result = await executeQuery(`
      INSERT INTO bookings (
        booking_number,
        package_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_details,
        guests_count,
        guests_details,
        departure_date,
        return_date,
        total_amount,
        paid_amount,
        currency,
        payment_status,
        booking_status,
        payment_method,
        payment_reference,
        special_requests,
        notes,
        cancellation_reason,
        cancellation_date,
        confirmed_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      bookingNumber,
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
      body.confirmed_at || null
    ]);

    // Get the created booking with package information
    const createdBookings = await executeQuery(`
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
        p.title_ar as package_title,
        p.title_en as package_title_en,
        p.price as package_price,
        p.duration_days as package_duration
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.id = ?
    `, [result.insertId]);

    if (!createdBookings || createdBookings.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve created booking'
      });
    }

    const bookingData = createdBookings[0];

    // Format the response
    return {
      success: true,
      message: 'Booking created successfully',
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
          id: body.package_id,
          title_ar: bookingData.package_title,
          title_en: bookingData.package_title_en,
          price: bookingData.package_price,
          duration_days: bookingData.package_duration
        }
      }
    };

  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create booking'
    });
  }
});
