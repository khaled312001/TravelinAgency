import { defineEventHandler } from 'h3';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

// GET /api/images/test - Test image accessibility
export default defineEventHandler(async (event) => {
  try {
    const importedDir = join(process.cwd(), 'public', 'images', 'packages', 'imported');
    const oldDir = join(process.cwd(), 'public', 'images', 'packages');
    
    // Check imported directory
    let importedImages = [];
    try {
      const files = await readdir(importedDir);
      importedImages = files.filter(file => {
        const ext = file.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      });
    } catch (error) {
      console.error('Error reading imported directory:', error);
    }
    
    // Check old directory
    let oldImages = [];
    try {
      const files = await readdir(oldDir);
      oldImages = files.filter(file => {
        const ext = file.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      });
    } catch (error) {
      console.error('Error reading old directory:', error);
    }
    
    // Test a few specific images
    const testImages = [
      'paris-romance.jpg',
      'tokyo-modern.jpg',
      'london-royal.jpg'
    ];
    
    const imageTests = [];
    
    for (const imageName of testImages) {
      const importedPath = join(importedDir, imageName);
      const oldPath = join(oldDir, imageName);
      
      let importedExists = false;
      let oldExists = false;
      
      try {
        await stat(importedPath);
        importedExists = true;
      } catch {
        importedExists = false;
      }
      
      try {
        await stat(oldPath);
        oldExists = true;
      } catch {
        oldExists = false;
      }
      
      imageTests.push({
        name: imageName,
        imported: {
          path: `/images/packages/imported/${imageName}`,
          exists: importedExists
        },
        old: {
          path: `/images/packages/${imageName}`,
          exists: oldExists
        }
      });
    }
    
    return {
      success: true,
      message: 'Image accessibility test completed',
      summary: {
        importedImages: importedImages.length,
        oldImages: oldImages.length,
        importedDirectory: importedDir,
        oldDirectory: oldDir
      },
      testResults: imageTests,
      importedImages: importedImages.slice(0, 10), // First 10 images
      oldImages: oldImages.slice(0, 10) // First 10 images
    };
    
  } catch (error: any) {
    console.error('Error testing images:', error);
    
    return {
      success: false,
      message: 'Failed to test images',
      error: error.message
    };
  }
});
