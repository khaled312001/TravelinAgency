import mysql from 'mysql2/promise';

// Database configuration for XAMPP
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wonderland_travel'
};

async function fixDatabase() {
  let connection;
  
  try {
    console.log('🔧 Connecting to MySQL database...');
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connected to database successfully');
    
    // Check if contact_messages table has is_read column
    console.log('🔍 Checking contact_messages table...');
    try {
      await connection.execute('SELECT is_read FROM contact_messages LIMIT 1');
      console.log('✅ contact_messages table is correct');
    } catch (error) {
      console.log('⚠️  Adding is_read column to contact_messages...');
      await connection.execute(`
        ALTER TABLE contact_messages 
        ADD COLUMN is_read BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Added is_read column to contact_messages');
    }
    
    // Check if users table has full_name column
    console.log('🔍 Checking users table...');
    try {
      await connection.execute('SELECT full_name FROM users LIMIT 1');
      console.log('✅ users table is correct');
    } catch (error) {
      console.log('⚠️  Adding full_name column to users...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN full_name VARCHAR(255)
      `);
      console.log('✅ Added full_name column to users');
    }
    
    // Check if users table has phone column
    console.log('🔍 Checking users table for phone column...');
    try {
      await connection.execute('SELECT phone FROM users LIMIT 1');
      console.log('✅ users table has phone column');
    } catch (error) {
      console.log('⚠️  Adding phone column to users...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN phone VARCHAR(20)
      `);
      console.log('✅ Added phone column to users');
    }
    
    // Check if users table has email_verified column
    console.log('🔍 Checking users table for email_verified column...');
    try {
      await connection.execute('SELECT email_verified FROM users LIMIT 1');
      console.log('✅ users table has email_verified column');
    } catch (error) {
      console.log('⚠️  Adding email_verified column to users...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Added email_verified column to users');
    }
    
    // Check if users table has status column
    console.log('🔍 Checking users table for status column...');
    try {
      await connection.execute('SELECT status FROM users LIMIT 1');
      console.log('✅ users table has status column');
    } catch (error) {
      console.log('⚠️  Adding status column to users...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
      `);
      console.log('✅ Added status column to users');
    }
    
    // Check if users table has created_at and updated_at columns
    console.log('🔍 Checking users table for timestamp columns...');
    try {
      await connection.execute('SELECT created_at, updated_at FROM users LIMIT 1');
      console.log('✅ users table has timestamp columns');
    } catch (error) {
      console.log('⚠️  Adding timestamp columns to users...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✅ Added timestamp columns to users');
    }
    
    // Check if packages table has views column
    console.log('🔍 Checking packages table for views column...');
    try {
      await connection.execute('SELECT views FROM packages LIMIT 1');
      console.log('✅ packages table has views column');
    } catch (error) {
      console.log('⚠️  Adding views column to packages...');
      await connection.execute(`
        ALTER TABLE packages 
        ADD COLUMN views INT DEFAULT 0
      `);
      console.log('✅ Added views column to packages');
    }
    
    // Check if packages table has category column
    console.log('🔍 Checking packages table for category column...');
    try {
      await connection.execute('SELECT category FROM packages LIMIT 1');
      console.log('✅ packages table has category column');
    } catch (error) {
      console.log('⚠️  Adding category column to packages...');
      await connection.execute(`
        ALTER TABLE packages 
        ADD COLUMN category VARCHAR(100)
      `);
      console.log('✅ Added category column to packages');
    }
    
    // Check if packages table has created_at and updated_at columns
    console.log('🔍 Checking packages table for timestamp columns...');
    try {
      await connection.execute('SELECT created_at, updated_at FROM packages LIMIT 1');
      console.log('✅ packages table has timestamp columns');
    } catch (error) {
      console.log('⚠️  Adding timestamp columns to packages...');
      await connection.execute(`
        ALTER TABLE packages 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✅ Added timestamp columns to packages');
    }
    
    // Check if destinations table has created_at and updated_at columns
    console.log('🔍 Checking destinations table for timestamp columns...');
    try {
      await connection.execute('SELECT created_at, updated_at FROM destinations LIMIT 1');
      console.log('✅ destinations table has timestamp columns');
    } catch (error) {
      console.log('⚠️  Adding timestamp columns to destinations...');
      await connection.execute(`
        ALTER TABLE destinations 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✅ Added timestamp columns to destinations');
    }
    
    console.log('\n🎉 Database structure fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix
fixDatabase();
