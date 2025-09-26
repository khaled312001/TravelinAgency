// Test database connection script
import mysql from 'mysql2/promise';

async function testConnection() {
  const config = {
    host: 'sg2plzcpnl508590.prod.sin2.secureserver.net',
    port: 3306,
    user: 'travel',
    password: 'support@Passord123',
    database: 'travel',
    charset: 'utf8mb4',
    timezone: '+00:00'
  };

  console.log('🔧 Testing database connection...');
  console.log('Config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password ? '[SET]' : '[EMPTY]',
    database: config.database
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    // Test if packages table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "packages"');
    console.log('📦 Packages table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      const [packageCount] = await connection.execute('SELECT COUNT(*) as count FROM packages');
      console.log('📦 Package count:', packageCount[0].count);
    }
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Solution: Check if the database host and port are correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Solution: Check if the username and password are correct');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Solution: Check if the database name is correct');
    }
  }
}

testConnection();
