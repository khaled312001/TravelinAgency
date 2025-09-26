import { defineEventHandler, readBody } from 'h3';
import { unlink } from 'fs/promises';
import { join } from 'path';

// POST /api/images/delete - Delete uploaded images
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { filename } = body;
    
    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Filename is required'
      });
    }
    
    const imagesDir = join(process.cwd(), 'public', 'images', 'packages', 'imported');
    const thumbnailsDir = join(process.cwd(), 'public', 'images', 'packages', 'thumbnails');
    
    const imagePath = join(imagesDir, filename);
    const thumbnailPath = join(thumbnailsDir, `thumb_${filename}`);
    
    // Delete main image
    try {
      await unlink(imagePath);
    } catch (error) {
      console.error(`Error deleting image ${filename}:`, error);
    }
    
    // Delete thumbnail
    try {
      await unlink(thumbnailPath);
    } catch (error) {
      console.error(`Error deleting thumbnail for ${filename}:`, error);
    }
    
    return {
      success: true,
      message: 'Image deleted successfully'
    };
    
  } catch (error: any) {
    console.error('Error deleting image:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image'
    });
  }
});
