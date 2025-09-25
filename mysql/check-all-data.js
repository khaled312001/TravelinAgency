#!/usr/bin/env node

const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
};

async function checkAllData() {
    let connection;
    
    try {
        console.log('🔧 Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully');
        
        // Check packages
        console.log('\n📦 PACKAGES:');
        const [packages] = await connection.execute(
            'SELECT id, title_ar, title_en, price, duration_days, image_url, featured, active FROM packages ORDER BY title_ar'
        );
        
        console.log(`   Total packages: ${packages.length}`);
        packages.forEach((pkg, index) => {
            console.log(`   ${index + 1}. ${pkg.title_ar} - ${pkg.price} ريال - ${pkg.duration_days} أيام - ${pkg.featured ? 'مميز' : 'عادي'} - ${pkg.active ? 'نشط' : 'غير نشط'}`);
            console.log(`      Image: ${pkg.image_url}`);
        });
        
        // Check destinations
        console.log('\n🌍 DESTINATIONS:');
        const [destinations] = await connection.execute(
            'SELECT id, name, country, city, type, status FROM destinations ORDER BY name'
        );
        
        console.log(`   Total destinations: ${destinations.length}`);
        destinations.forEach((dest, index) => {
            console.log(`   ${index + 1}. ${dest.name} - ${dest.country} - ${dest.city} - ${dest.type} - ${dest.status}`);
        });
        
        // Check contact messages
        console.log('\n📧 CONTACT MESSAGES:');
        const [messages] = await connection.execute(
            'SELECT id, name, email, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
        );
        
        console.log(`   Total messages: ${messages.length}`);
        messages.forEach((msg, index) => {
            console.log(`   ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} - ${msg.status}`);
        });
        
        // Check admin users
        console.log('\n👤 ADMIN USERS:');
        const [admins] = await connection.execute(`
            SELECT u.email, u.full_name, ap.role 
            FROM users u 
            JOIN admin_profiles ap ON u.id = ap.user_id 
            ORDER BY u.email
        `);
        
        console.log(`   Total admin users: ${admins.length}`);
        admins.forEach((admin, index) => {
            console.log(`   ${index + 1}. ${admin.email} - ${admin.full_name} - ${admin.role}`);
        });
        
        console.log('\n🎉 Data check completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkAllData();
