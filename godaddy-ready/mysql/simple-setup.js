#!/usr/bin/env node

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function setupAdmin() {
    let connection;
    
    try {
        console.log('🚀 Setting up admin user...');
        
        // Connect to MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'wonderland_travel'
        });
        
        console.log('✅ Connected to MySQL database');
        
        // Hash the admin password
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        
        // Create admin user (using existing table structure)
        await connection.query(`
            INSERT IGNORE INTO users (name, email, password, email_verified_at, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW(), NOW())
        `, [
            process.env.ADMIN_NAME || 'System Administrator',
            process.env.ADMIN_EMAIL || 'admin@wonderland.com',
            hashedPassword
        ]);
        
        console.log('✅ Admin user created/updated');
        
        // Get the admin user ID
        const [users] = await connection.query(
            'SELECT id FROM users WHERE email = ?',
            [process.env.ADMIN_EMAIL || 'admin@wonderland.com']
        );
        
        if (users.length === 0) {
            throw new Error('Failed to create admin user');
        }
        
        const adminUserId = users[0].id;
        
        // Create/update admin profile
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
        
        await connection.query(`
            INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            role = VALUES(role),
            permissions = VALUES(permissions),
            updated_at = NOW()
        `, [adminUserId, 'super_admin', JSON.stringify(permissions)]);
        
        console.log('✅ Admin profile created/updated');
        
        // Log the activity
        await connection.query(`
            INSERT INTO activity_logs (user_id, action, title, type, details, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [
            adminUserId,
            'admin_setup',
            'Admin Account Setup Complete',
            'system',
            JSON.stringify({
                email: process.env.ADMIN_EMAIL || 'admin@wonderland.com',
                role: 'super_admin'
            })
        ]);
        
        console.log('✅ Activity logged');
        
        console.log('\n🎉 Admin setup completed successfully!');
        console.log('\n🔐 Admin Login Credentials:');
        console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@wonderland.com'}`);
        console.log(`Password: ${adminPassword}`);
        console.log('\n⚠️  Please change the default password after first login!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupAdmin();
