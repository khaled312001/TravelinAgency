import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Database configuration for XAMPP
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wonderland_travel'
};

async function setupAdmin() {
  let connection;
  
  try {
    console.log('🔧 Connecting to MySQL database...');
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connected to database successfully');
    
    // Create admin user
    const adminEmail = 'admin@wonderland.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    console.log('👤 Creating admin user...');
    
    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists');
      return;
    }
    
    // Create user
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, full_name, phone, email_verified, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, TRUE, 'active', NOW(), NOW())`,
      [adminEmail, hashedPassword, 'مدير النظام', '+966501234567']
    );
    
    const userId = userResult.insertId;
    console.log(`✅ Admin user created with ID: ${userId}`);
    
    // Create admin profile
    const defaultPermissions = {
      manage_users: true,
      manage_packages: true,
      manage_destinations: true,
      manage_bookings: true,
      manage_messages: true,
      view_analytics: true,
      manage_settings: true,
      manage_admins: true
    };
    
    await connection.execute(
      `INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [userId, 'super_admin', JSON.stringify(defaultPermissions)]
    );
    
    console.log('✅ Admin profile created successfully');
    
    console.log('\n🎉 Admin setup completed successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('\n🌐 You can now login at: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupAdmin();
