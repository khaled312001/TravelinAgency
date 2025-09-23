import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createBookingsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
  });

  try {
    console.log('🔧 Creating bookings table...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        package_id INT,
        package_title VARCHAR(255) NOT NULL,
        travel_date DATE NOT NULL,
        return_date DATE,
        adults INT DEFAULT 1,
        children INT DEFAULT 0,
        infants INT DEFAULT 0,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'SAR',
        special_requests TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_email (customer_email),
        INDEX idx_status (status),
        INDEX idx_travel_date (travel_date),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableSQL);
    console.log('✅ bookings table created successfully');

    // Insert sample booking data
    const insertSampleData = `
      INSERT INTO bookings (booking_number, customer_name, customer_email, customer_phone, package_id, package_title, travel_date, return_date, adults, children, status, payment_status, total_amount, currency, special_requests) VALUES
      ('BK001', 'أحمد محمد العتيبي', 'ahmed@example.com', '+966501234567', 1, 'رحلة إلى دبي - 5 أيام', '2024-02-15', '2024-02-20', 2, 1, 'confirmed', 'paid', 7500.00, 'SAR', 'غرفة متصلة للعائلة'),
      ('BK002', 'فاطمة علي الشمري', 'fatima@example.com', '+966507654321', 2, 'عمرة رمضان المباركة', '2024-03-01', '2024-03-08', 1, 0, 'pending', 'pending', 1800.00, 'SAR', 'فندق قريب من الحرم'),
      ('BK003', 'محمد عبدالله القحطاني', 'mohammed@example.com', '+966503456789', 3, 'رحلة إلى تركيا - إسطنبول', '2024-02-25', '2024-03-02', 2, 0, 'confirmed', 'paid', 12000.00, 'SAR', 'جولة في المدينة القديمة'),
      ('BK004', 'نورا سعد المطيري', 'nora@example.com', '+966504567890', 4, 'رحلة إلى ماليزيا - كوالالمبور', '2024-03-10', '2024-03-17', 3, 2, 'pending', 'pending', 15000.00, 'SAR', 'رحلات عائلية مناسبة للأطفال'),
      ('BK005', 'خالد أحمد الزهراني', 'khalid@example.com', '+966505678901', 5, 'رحلة إلى تايلاند - بانكوك', '2024-02-20', '2024-02-27', 2, 1, 'cancelled', 'refunded', 8500.00, 'SAR', 'تم الإلغاء بسبب ظروف صحية')
    `;

    await connection.execute(insertSampleData);
    console.log('✅ Sample booking data inserted');

    // Verify the table
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Total bookings: ${rows[0].count}`);

    // Show status breakdown
    const [statusRows] = await connection.execute(`
      SELECT status, COUNT(*) as count 
      FROM bookings 
      GROUP BY status
    `);
    console.log('📈 Booking status breakdown:');
    statusRows.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error creating bookings table:', error.message);
  } finally {
    await connection.end();
  }
}

createBookingsTable();
