import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
  });

  try {
    console.log('🔍 Checking required tables...');

    // Check if tables exist
    const tables = [
      'packages',
      'destinations', 
      'contact_messages',
      'users',
      'admin_profiles',
      'activity_logs',
      'content_pages',
      'bookings'
    ];

    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`✅ Table '${table}' exists`);
          
          // Check if table has data
          const [countRows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   📊 Records: ${countRows[0].count}`);
        } else {
          console.log(`❌ Table '${table}' does not exist`);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${table}':`, error.message);
      }
    }

    // Test admin stats query
    console.log('\n🧪 Testing admin stats query...');
    try {
      const [packagesResult] = await connection.execute('SELECT COUNT(*) as count FROM packages');
      const [destinationsResult] = await connection.execute('SELECT COUNT(*) as count FROM destinations');
      const [messagesResult] = await connection.execute('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0');
      const [usersResult] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [bookingsResult] = await connection.execute('SELECT COUNT(*) as count FROM bookings');

      console.log('📈 Admin Stats:');
      console.log(`   Packages: ${packagesResult[0].count}`);
      console.log(`   Destinations: ${destinationsResult[0].count}`);
      console.log(`   Unread Messages: ${messagesResult[0].count}`);
      console.log(`   Users: ${usersResult[0].count}`);
      console.log(`   Bookings: ${bookingsResult[0].count}`);
    } catch (error) {
      console.log('❌ Error testing admin stats:', error.message);
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTables();
