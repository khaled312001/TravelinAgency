#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

async function resetDatabase() {
    let connection;
    
    try {
        console.log('🚀 Resetting MySQL database...');
        
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL server');
        
        // Drop and recreate database
        console.log('🗑️ Dropping existing database...');
        await connection.query('DROP DATABASE IF EXISTS wonderland_travel');
        console.log('✅ Database dropped');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');
        
        console.log('📋 Creating new database with schema...');
        await connection.query(schemaSql);
        console.log('✅ Database schema created successfully');
        
        console.log('\n🎉 Database reset completed successfully!');
        console.log('\n🔐 Admin Login Credentials:');
        console.log('Email: admin@wonderland.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('❌ Reset failed:', error.message);
        console.error('Full error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

resetDatabase();
