import { defineEventHandler } from 'h3';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

// GET /api/images/list - List uploaded images
export default defineEventHandler(async (event) => {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images', 'packages', 'imported');
    const thumbnailsDir = join(process.cwd(), 'public', 'images', 'packages', 'thumbnails');
    
    // Read imported images directory
    const files = await readdir(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    const images = [];
    
    for (const file of imageFiles) {
      try {
        const filePath = join(imagesDir, file);
        const stats = await stat(filePath);
        
        // Check if thumbnail exists
        const thumbnailFile = `thumb_${file}`;
        const thumbnailPath = join(thumbnailsDir, thumbnailFile);
        let thumbnailExists = false;
        
        try {
          await stat(thumbnailPath);
          thumbnailExists = true;
        } catch {
          thumbnailExists = false;
        }
        
        images.push({
          filename: file,
          originalName: file,
          path: `/images/packages/imported/${file}`,
          thumbnailPath: thumbnailExists ? `/images/packages/thumbnails/${thumbnailFile}` : null,
          size: stats.size,
          type: getMimeType(extname(file)),
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      message: 'Images retrieved successfully',
      images: images
    };
    
  } catch (error: any) {
    console.error('Error listing images:', error);
    
    return {
      success: false,
      message: 'Failed to list images',
      images: []
    };
  }
});

// Helper function to get MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
}
