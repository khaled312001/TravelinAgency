#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
};

// Available images in the packages folder
const availableImages = [
    'bali-paradise.jpg',
    'dubai-luxury.jpg', 
    'london-royal.jpg',
    'machu-picchu.jpg',
    'maldives-luxury.jpg',
    'new-york-explorer.jpg',
    'paris-romance.jpg',
    'rome-historical.jpg',
    'santorini-paradise.jpg',
    'tokyo-modern.jpg'
];

// Mapping of package titles to available images
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

async function fixMissingImages() {
    let connection;
    
    try {
        console.log('🔧 Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully');
        
        console.log('🖼️ Checking and fixing image paths...');
        
        // Get all packages
        const [packages] = await connection.execute(
            'SELECT id, title_ar, image_url FROM packages ORDER BY title_ar'
        );
        
        console.log(`📦 Found ${packages.length} packages`);
        
        for (const pkg of packages) {
            const correctImagePath = imageMapping[pkg.title_ar];
            
            if (correctImagePath) {
                // Check if the image file actually exists
                const imagePath = path.join(__dirname, '..', 'public', correctImagePath);
                const imageExists = fs.existsSync(imagePath);
                
                if (imageExists) {
                    // Update the image path if it's different
                    if (pkg.image_url !== correctImagePath) {
                        await connection.execute(
                            'UPDATE packages SET image_url = ? WHERE id = ?',
                            [correctImagePath, pkg.id]
                        );
                        console.log(`✅ Updated: ${pkg.title_ar} -> ${correctImagePath}`);
                    } else {
                        console.log(`✅ OK: ${pkg.title_ar} -> ${correctImagePath}`);
                    }
                } else {
                    console.log(`❌ Image not found: ${correctImagePath}`);
                    
                    // Use a fallback image
                    const fallbackImage = '/images/packages/pexels-photo-1010657.jpg';
                    await connection.execute(
                        'UPDATE packages SET image_url = ? WHERE id = ?',
                        [fallbackImage, pkg.id]
                    );
                    console.log(`🔄 Using fallback: ${pkg.title_ar} -> ${fallbackImage}`);
                }
            } else {
                console.log(`⚠️ No mapping found for: ${pkg.title_ar}`);
            }
        }
        
        // Final check
        console.log('\n📋 Final image paths:');
        const [finalPackages] = await connection.execute(
            'SELECT title_ar, image_url FROM packages ORDER BY title_ar'
        );
        
        finalPackages.forEach(pkg => {
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

fixMissingImages();
