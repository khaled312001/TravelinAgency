import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkBookingsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
  });

  try {
    console.log('🔍 Checking bookings table structure...');

    // Check if table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'bookings'");
    if (tables.length === 0) {
      console.log('❌ bookings table does not exist');
      return;
    }

    console.log('✅ bookings table exists');

    // Get table structure
    const [columns] = await connection.execute("DESCRIBE bookings");
    console.log('📋 Table structure:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? col.Key : ''}`);
    });

    // Check if table has data
    const [countRows] = await connection.execute('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Records: ${countRows[0].count}`);

  } catch (error) {
    console.error('❌ Error checking bookings table:', error.message);
  } finally {
    await connection.end();
  }
}

checkBookingsTable();
