import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script to update image paths in the frontend to handle both old and new paths
async function updateImagePaths() {
  try {
    console.log('🚀 Starting image paths update...');
    
    // List of files that need to be updated
    const filesToUpdate = [
      'components/packages/PackageCard.vue',
      'pages/packages/[id].vue',
      'pages/media-gallery.vue'
    ];
    
    let updatedCount = 0;
    
    for (const filePath of filesToUpdate) {
      try {
        const fullPath = path.join(__dirname, '..', filePath);
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Check if file exists
        try {
          await fs.access(fullPath);
        } catch {
          console.log(`⏭️  Skipping ${filePath} (file not found)`);
          continue;
        }
        
        let updatedContent = content;
        let hasChanges = false;
        
        // Update image path handling to try both old and new paths
        if (content.includes('props.package_.image_url') || content.includes('package_.image_url')) {
          // Add fallback logic for image paths
          const fallbackLogic = `
// Helper function to get correct image path
const getImagePath = (imageUrl) => {
  if (!imageUrl) return '/images/placeholder.svg';
  
  // If it's already a new path, return as is
  if (imageUrl.includes('/imported/')) {
    return imageUrl;
  }
  
  // If it's an old path, try the new path first, then fallback to old
  if (imageUrl.includes('/images/packages/') && !imageUrl.includes('/imported/')) {
    const filename = path.basename(imageUrl);
    const newPath = \`/images/packages/imported/\${filename}\`;
    return newPath;
  }
  
  return imageUrl;
};`;
          
          // Add the helper function if not already present
          if (!content.includes('getImagePath')) {
            updatedContent = updatedContent.replace(
              /<script setup[^>]*>/,
              `$&${fallbackLogic}`
            );
            hasChanges = true;
          }
          
          // Update image src to use the helper function
          updatedContent = updatedContent.replace(
            /:src="props\.package_\.image_url"/g,
            ':src="getImagePath(props.package_.image_url)"'
          );
          updatedContent = updatedContent.replace(
            /:src="package_\.image_url"/g,
            ':src="getImagePath(package_.image_url)"'
          );
          updatedContent = updatedContent.replace(
            /src="package_\.image_url"/g,
            'src="getImagePath(package_.image_url)"'
          );
          
          if (updatedContent !== content) {
            hasChanges = true;
          }
        }
        
        if (hasChanges) {
          await fs.writeFile(fullPath, updatedContent, 'utf8');
          console.log(`✅ Updated ${filePath}`);
          updatedCount++;
        } else {
          console.log(`⏭️  No changes needed for ${filePath}`);
        }
        
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} files`);
    console.log(`   📁 Total processed: ${filesToUpdate.length} files`);
    
    console.log('\n🎉 Image paths update completed successfully!');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

// Run update if this script is executed directly
updateImagePaths();

export { updateImagePaths };
