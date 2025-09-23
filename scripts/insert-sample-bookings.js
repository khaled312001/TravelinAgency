import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function insertSampleBookings() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
  });

  try {
    console.log('🔧 Inserting sample booking data...');

    // First, get some package IDs
    const [packages] = await connection.execute('SELECT id FROM packages LIMIT 5');
    if (packages.length === 0) {
      console.log('❌ No packages found. Please add packages first.');
      return;
    }

    console.log(`📦 Found ${packages.length} packages`);

    // Insert sample booking data
    const insertSampleData = `
      INSERT INTO bookings (
        id, booking_number, package_id, customer_name, customer_email, customer_phone,
        guests_count, departure_date, return_date, total_amount, paid_amount, currency,
        payment_status, booking_status, special_requests, created_at, updated_at
      ) VALUES
      (UUID(), 'BK001', ?, 'أحمد محمد العتيبي', 'ahmed@example.com', '+966501234567', 
       3, '2024-02-15', '2024-02-20', 7500.00, 7500.00, 'SAR', 
       'paid', 'confirmed', 'غرفة متصلة للعائلة', NOW(), NOW()),
      (UUID(), 'BK002', ?, 'فاطمة علي الشمري', 'fatima@example.com', '+966507654321', 
       1, '2024-03-01', '2024-03-08', 1800.00, 0.00, 'SAR', 
       'pending', 'pending', 'فندق قريب من الحرم', NOW(), NOW()),
      (UUID(), 'BK003', ?, 'محمد عبدالله القحطاني', 'mohammed@example.com', '+966503456789', 
       2, '2024-02-25', '2024-03-02', 12000.00, 12000.00, 'SAR', 
       'paid', 'confirmed', 'جولة في المدينة القديمة', NOW(), NOW()),
      (UUID(), 'BK004', ?, 'نورا سعد المطيري', 'nora@example.com', '+966504567890', 
       5, '2024-03-10', '2024-03-17', 15000.00, 5000.00, 'SAR', 
       'partial', 'pending', 'رحلات عائلية مناسبة للأطفال', NOW(), NOW()),
      (UUID(), 'BK005', ?, 'خالد أحمد الزهراني', 'khalid@example.com', '+966505678901', 
       3, '2024-02-20', '2024-02-27', 8500.00, 0.00, 'SAR', 
       'refunded', 'cancelled', 'تم الإلغاء بسبب ظروف صحية', NOW(), NOW()),
      (UUID(), 'BK006', ?, 'ريم عبدالرحمن الغامدي', 'reem@example.com', '+966506789012', 
       2, '2024-04-05', '2024-04-12', 18000.00, 18000.00, 'SAR', 
       'paid', 'confirmed', 'جولة في المعالم التاريخية', NOW(), NOW()),
      (UUID(), 'BK007', ?, 'عبدالعزيز محمد النعيمي', 'abdulaziz@example.com', '+966507890123', 
       6, '2024-03-15', '2024-03-22', 25000.00, 0.00, 'SAR', 
       'pending', 'pending', 'عائلة كبيرة - غرف متجاورة', NOW(), NOW()),
      (UUID(), 'BK008', ?, 'هند سلمان الدوسري', 'hind@example.com', '+966508901234', 
       2, '2024-04-20', '2024-04-27', 22000.00, 22000.00, 'SAR', 
       'paid', 'confirmed', 'جولة رومانسية للزوجين', NOW(), NOW())
    `;

    // Use the first 8 packages (or repeat if less than 8)
    const packageIds = [];
    for (let i = 0; i < 8; i++) {
      packageIds.push(packages[i % packages.length].id);
    }

    await connection.execute(insertSampleData, packageIds);
    console.log('✅ Sample booking data inserted successfully');

    // Verify the data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Total bookings: ${rows[0].count}`);

    // Show status breakdown
    const [statusRows] = await connection.execute(`
      SELECT booking_status, COUNT(*) as count 
      FROM bookings 
      GROUP BY booking_status
    `);
    console.log('📈 Booking status breakdown:');
    statusRows.forEach(row => {
      console.log(`   ${row.booking_status}: ${row.count}`);
    });

    // Show payment status breakdown
    const [paymentRows] = await connection.execute(`
      SELECT payment_status, COUNT(*) as count 
      FROM bookings 
      GROUP BY payment_status
    `);
    console.log('💰 Payment status breakdown:');
    paymentRows.forEach(row => {
      console.log(`   ${row.payment_status}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error inserting sample bookings:', error.message);
  } finally {
    await connection.end();
  }
}

insertSampleBookings();
