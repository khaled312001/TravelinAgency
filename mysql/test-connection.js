#!/usr/bin/env node

const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

async function testConnection() {
    let connection;
    
    try {
        console.log('🔍 Testing database connection...');
        
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL server');
        
        // Check if database exists
        const [databases] = await connection.query('SHOW DATABASES LIKE "wonderland_travel"');
        if (databases.length === 0) {
            console.log('📋 Creating database...');
            await connection.query('CREATE DATABASE wonderland_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            console.log('✅ Database created');
        } else {
            console.log('✅ Database already exists');
        }
        
        // Use the database
        await connection.query('USE wonderland_travel');
        
        // Check if users table exists
        const [tables] = await connection.query('SHOW TABLES LIKE "users"');
        if (tables.length === 0) {
            console.log('📋 Creating users table...');
            await connection.query(`
                CREATE TABLE users (
                    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    phone VARCHAR(50),
                    email_verified BOOLEAN DEFAULT FALSE,
                    email_verified_at TIMESTAMP NULL,
                    password_reset_token VARCHAR(255) NULL,
                    password_reset_expires TIMESTAMP NULL,
                    last_login TIMESTAMP NULL,
                    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Users table created');
        } else {
            console.log('✅ Users table already exists');
        }
        
        console.log('🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testConnection();
