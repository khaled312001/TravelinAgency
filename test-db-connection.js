import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  console.log('🔧 Testing MySQL Connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'travel',
    password: process.env.DB_PASSWORD || 'support@Passord123',
    database: process.env.DB_NAME || 'travel',
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    acquireTimeout: 60000,
    timeout: 60000
  };

  console.log('📋 Connection Config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password ? '[SET]' : '[EMPTY]',
    database: config.database,
    ssl: config.ssl ? 'enabled' : 'disabled'
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Query test successful:', rows[0]);
    
    // Test if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Available tables:', tables.length);
    
    if (tables.length > 0) {
      console.log('Table names:', tables.map(t => Object.values(t)[0]));
    }
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Number:', error.errno);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: Check if your database host and port are correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Suggestion: Check your database username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Suggestion: Check if your database name exists');
    }
  }
}

testConnection();