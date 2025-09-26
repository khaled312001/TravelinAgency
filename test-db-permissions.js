// Test database permissions with different configurations
import mysql from 'mysql2/promise';

async function testPermissions() {
  const baseConfig = {
    host: 'sg2plzcpnl508590.prod.sin2.secureserver.net',
    port: 3306,
    database: 'travel',
    charset: 'utf8mb4',
    timezone: '+00:00'
  };

  // Test different user configurations
  const testConfigs = [
    {
      name: 'Current user (travel)',
      config: { ...baseConfig, user: 'travel', password: 'support@Passord123' }
    },
    {
      name: 'Try with database prefix',
      config: { ...baseConfig, user: 'travel_travel', password: 'support@Passord123' }
    },
    {
      name: 'Try with full username',
      config: { ...baseConfig, user: 'travel@sg2plzcpnl508590.prod.sin2.secureserver.net', password: 'support@Passord123' }
    }
  ];

  for (const test of testConfigs) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log('Config:', {
      host: test.config.host,
      user: test.config.user,
      database: test.config.database,
      password: test.config.password ? '[SET]' : '[EMPTY]'
    });

    try {
      const connection = await mysql.createConnection(test.config);
      console.log('✅ Connection successful!');
      
      // Test basic query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Query test successful:', rows);
      
      // Test if we can access packages table
      const [tables] = await connection.execute('SHOW TABLES LIKE "packages"');
      console.log('📦 Packages table accessible:', tables.length > 0);
      
      if (tables.length > 0) {
        const [packageCount] = await connection.execute('SELECT COUNT(*) as count FROM packages');
        console.log('📦 Package count:', packageCount[0].count);
      }
      
      await connection.end();
      console.log('✅ This configuration works!');
      
      // If this works, update the environment variables
      console.log('\n🎉 SUCCESS! Use these environment variables in Vercel:');
      console.log(`DB_HOST=${test.config.host}`);
      console.log(`DB_PORT=${test.config.port}`);
      console.log(`DB_USER=${test.config.user}`);
      console.log(`DB_PASSWORD=${test.config.password}`);
      console.log(`DB_NAME=${test.config.database}`);
      
      return; // Exit on first successful configuration
      
    } catch (error) {
      console.error('❌ Failed:', {
        message: error.message,
        code: error.code,
        errno: error.errno
      });
      
      if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
        console.log('💡 Database access denied - check user permissions in GoDaddy cPanel');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('💡 Access denied - check username/password');
      }
    }
  }
  
  console.log('\n❌ All configurations failed. You need to:');
  console.log('1. Check user permissions in GoDaddy cPanel');
  console.log('2. Make sure the user has access to the database');
  console.log('3. Or create a new user with proper permissions');
}

testPermissions();
