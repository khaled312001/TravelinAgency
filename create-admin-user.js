#!/usr/bin/env node

// Script to create admin user for the TravelinAgency website
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'travel',
  password: 'support@Passord123',
  database: 'travel'
};

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, email FROM users WHERE email = ?',
      ['admin@wonderland.com']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️ Admin user already exists:', existingUsers[0].email);
      console.log('🔄 Updating admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Update existing user
      await connection.execute(
        'UPDATE users SET password = ?, full_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE email = ?',
        [hashedPassword, 'مدير النظام', '+966501234567', 'active', 'admin@wonderland.com']
      );
      
      const userId = existingUsers[0].id;
      
      // Update or create admin profile
      await connection.execute(`
        INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        role = VALUES(role),
        permissions = VALUES(permissions),
        updated_at = NOW()
      `, [userId, 'super_admin', JSON.stringify({
        'users.create': true,
        'users.read': true,
        'users.update': true,
        'users.delete': true,
        'packages.create': true,
        'packages.read': true,
        'packages.update': true,
        'packages.delete': true,
        'destinations.create': true,
        'destinations.read': true,
        'destinations.update': true,
        'destinations.delete': true,
        'bookings.create': true,
        'bookings.read': true,
        'bookings.update': true,
        'bookings.delete': true,
        'content.create': true,
        'content.read': true,
        'content.update': true,
        'content.delete': true,
        'settings.read': true,
        'settings.update': true,
        'analytics.read': true,
        'reports.read': true
      })]);
      
      console.log('✅ Admin user updated successfully');
      
    } else {
      console.log('🆕 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create user
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, full_name, phone, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        ['admin@wonderland.com', hashedPassword, 'مدير النظام', '+966501234567', 'active']
      );
      
      const userId = userResult.insertId;
      console.log('✅ User created with ID:', userId);
      
      // Create admin profile
      await connection.execute(
        'INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [userId, 'super_admin', JSON.stringify({
          'users.create': true,
          'users.read': true,
          'users.update': true,
          'users.delete': true,
          'packages.create': true,
          'packages.read': true,
          'packages.update': true,
          'packages.delete': true,
          'destinations.create': true,
          'destinations.read': true,
          'destinations.update': true,
          'destinations.delete': true,
          'bookings.create': true,
          'bookings.read': true,
          'bookings.update': true,
          'bookings.delete': true,
          'content.create': true,
          'content.read': true,
          'content.update': true,
          'content.delete': true,
          'settings.read': true,
          'settings.update': true,
          'analytics.read': true,
          'reports.read': true
        })]
      );
      
      console.log('✅ Admin profile created successfully');
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 Email: admin@wonderland.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: super_admin');
    console.log('\n🌐 You can now login to: https://worldtripagency.com/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('1. Database credentials in the script');
      console.log('2. MySQL server is running');
      console.log('3. Database "travel" exists');
      console.log('4. User "travel" has proper permissions');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Database tables not found. Please run the database setup first.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
createAdminUser();
