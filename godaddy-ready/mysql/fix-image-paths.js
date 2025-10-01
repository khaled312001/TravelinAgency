#!/usr/bin/env node

const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
};

// Mapping of package titles to correct image paths
const imageMapping = {
    'رومانسية وثقافة باريس': '/images/packages/paris-romance.jpg',
    'مغامرة طوكيو العصرية': '/images/packages/tokyo-modern.jpg',
    'مستكشف مدينة نيويورك': '/images/packages/new-york-explorer.jpg',
    'دبي الفاخرة والصحراء': '/images/packages/dubai-luxury.jpg',
    'رحلة تاريخية إلى روما': '/images/packages/rome-historical.jpg',
    'هروب إلى جنة بالي': '/images/packages/bali-paradise.jpg',
    'تجربة لندن الملكية': '/images/packages/london-royal.jpg',
    'جنة سانتوريني اليونانية': '/images/packages/santorini-paradise.jpg',
    'مغامرة ماتشو بيتشو': '/images/packages/machu-picchu.jpg',
    'ملاذ مالي الفاخر': '/images/packages/maldives-luxury.jpg'
};

async function fixImagePaths() {
    let connection;
    
    try {
        console.log('🔧 Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully');
        
        console.log('🖼️ Fixing image paths...');
        
        for (const [title, imagePath] of Object.entries(imageMapping)) {
            const [result] = await connection.execute(
                'UPDATE packages SET image_url = ? WHERE title_ar = ?',
                [imagePath, title]
            );
            
            if (result.affectedRows > 0) {
                console.log(`✅ Updated image for: ${title}`);
            } else {
                console.log(`⚠️ No package found for: ${title}`);
            }
        }
        
        // Check current image paths
        console.log('\n📋 Current image paths:');
        const [packages] = await connection.execute(
            'SELECT title_ar, image_url FROM packages ORDER BY title_ar'
        );
        
        packages.forEach(pkg => {
            console.log(`   ${pkg.title_ar}: ${pkg.image_url}`);
        });
        
        console.log('\n🎉 Image paths fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

fixImagePaths();
