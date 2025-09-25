#!/usr/bin/env node

/**
 * MySQL Database Setup Script for Wonder Land Traveling Agency
 * This script sets up the database and creates the initial admin user
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🚀 Starting MySQL database setup...');
        
        // Connect to MySQL server (without specifying database)
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL server');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');
        
        console.log('📋 Executing database schema...');
        await connection.query(schemaSql);
        console.log('✅ Database schema created successfully');
        
        // Verify admin user was created
        const [adminUsers] = await connection.query(
            'SELECT u.email, ap.role FROM wonderland_travel.users u JOIN wonderland_travel.admin_profiles ap ON u.id = ap.user_id WHERE u.email = ?',
            [process.env.ADMIN_EMAIL || 'admin@wonderland.com']
        );
        
        if (adminUsers.length > 0) {
            console.log('✅ Admin user created successfully');
            console.log(`📧 Admin Email: ${adminUsers[0].email}`);
            console.log(`👤 Admin Role: ${adminUsers[0].role}`);
            console.log('🔑 Default Password: admin123 (Please change this after first login)');
        } else {
            console.log('⚠️  Admin user not found, creating manually...');
            await createAdminUser(connection);
        }
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Update your application configuration to use MySQL');
        console.log('2. Change the default admin password');
        console.log('3. Configure your connection settings in your app');
        console.log('\n🔐 Admin Login Credentials:');
        console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@wonderland.com'}`);
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function createAdminUser(connection) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wonderland.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+966501234567';
    
    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    
    // Create user
    const [userResult] = await connection.query(
        'INSERT INTO wonderland_travel.users (email, password, full_name, phone, email_verified, status) VALUES (?, ?, ?, ?, TRUE, "active")',
        [adminEmail, passwordHash, adminName, adminPhone]
    );
    
    const userId = userResult.insertId;
    
    // Create admin profile
    const permissions = {
        manage_users: true,
        manage_packages: true,
        manage_destinations: true,
        manage_bookings: true,
        manage_messages: true,
        view_analytics: true,
        manage_settings: true,
        manage_admins: true
    };
    
    await connection.query(
        'INSERT INTO wonderland_travel.admin_profiles (user_id, role, permissions) VALUES (?, "super_admin", ?)',
        [userId, JSON.stringify(permissions)]
    );
    
    console.log('✅ Admin user created manually');
}

// Test database connection
async function testConnection() {
    let connection;
    
    try {
        console.log('🔍 Testing database connection...');
        
        connection = await mysql.createConnection({
            ...dbConfig,
            database: 'wonderland_travel'
        });
        
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Connection successful');
        console.log(`📊 Total users in database: ${rows[0].count}`);
        
        const [adminCount] = await connection.query('SELECT COUNT(*) as count FROM admin_profiles');
        console.log(`👥 Total admin users: ${adminCount[0].count}`);
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Main execution
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'test':
            testConnection();
            break;
        case 'setup':
        default:
            setupDatabase();
            break;
    }
}
