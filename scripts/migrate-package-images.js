import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script to migrate existing package images to new folder structure
async function migratePackageImages() {
  try {
    console.log('🚀 Starting package images migration...');
    
    const sourceDir = path.join(__dirname, '..', 'public', 'images', 'packages');
    const importedDir = path.join(sourceDir, 'imported');
    const thumbnailsDir = path.join(sourceDir, 'thumbnails');
    
    // Ensure directories exist
    await fs.mkdir(importedDir, { recursive: true });
    await fs.mkdir(thumbnailsDir, { recursive: true });
    
    // Read all files in packages directory
    const files = await fs.readdir(sourceDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`📁 Found ${imageFiles.length} image files to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const file of imageFiles) {
      try {
        const sourcePath = path.join(sourceDir, file);
        const importedPath = path.join(importedDir, file);
        const thumbnailPath = path.join(thumbnailsDir, `thumb_${file}`);
        
        // Check if file already exists in imported directory
        try {
          await fs.access(importedPath);
          console.log(`⏭️  Skipping ${file} (already exists)`);
          skippedCount++;
          continue;
        } catch {
          // File doesn't exist, proceed with migration
        }
        
        // Copy to imported directory
        await fs.copyFile(sourcePath, importedPath);
        
        // Create thumbnail (for now, just copy the same file)
        await fs.copyFile(sourcePath, thumbnailPath);
        
        console.log(`✅ Migrated ${file}`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Error migrating ${file}:`, error.message);
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migratedCount} files`);
    console.log(`   ⏭️  Skipped: ${skippedCount} files`);
    console.log(`   📁 Total processed: ${imageFiles.length} files`);
    
    // Update database image URLs
    console.log('\n🔄 Updating database image URLs...');
    await updateDatabaseImageUrls();
    
    console.log('\n🎉 Package images migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Function to update database image URLs
async function updateDatabaseImageUrls() {
  try {
    
    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'wonderland_user',
      password: process.env.DB_PASSWORD || 'wonderland_pass',
      database: process.env.DB_NAME || 'wonderland_travel'
    };
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Get all packages with image URLs
    const [packages] = await connection.execute(`
      SELECT id, image_url 
      FROM packages 
      WHERE image_url IS NOT NULL AND image_url != ''
    `);
    
    console.log(`📦 Found ${packages.length} packages with image URLs`);
    
    let updatedCount = 0;
    
    for (const pkg of packages) {
      try {
        let newImageUrl = pkg.image_url;
        
        // Update old image paths to new structure
        if (newImageUrl.includes('/images/packages/') && !newImageUrl.includes('/imported/')) {
          // Extract filename from old path
          const filename = path.basename(newImageUrl);
          newImageUrl = `/images/packages/imported/${filename}`;
          
          // Update database
          await connection.execute(
            'UPDATE packages SET image_url = ? WHERE id = ?',
            [newImageUrl, pkg.id]
          );
          
          console.log(`🔄 Updated package ${pkg.id}: ${pkg.image_url} → ${newImageUrl}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating package ${pkg.id}:`, error.message);
      }
    }
    
    await connection.end();
    
    console.log(`📊 Database update summary:`);
    console.log(`   🔄 Updated: ${updatedCount} packages`);
    
  } catch (error) {
    console.error('❌ Database update failed:', error);
  }
}

// Run migration if this script is executed directly
migratePackageImages();

export { migratePackageImages };
