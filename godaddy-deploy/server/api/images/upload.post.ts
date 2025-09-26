import { defineEventHandler, readMultipartFormData } from 'h3';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/images/upload - Upload package images
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      });
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), 'public', 'images', 'packages', 'imported');
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    for (const file of formData) {
      if (file.data && file.filename) {
        // Generate unique filename
        const fileExtension = extname(file.filename);
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const filePath = join(uploadDir, uniqueFilename);
        
        // Write file to disk
        await writeFile(filePath, file.data);
        
        // Generate thumbnail path
        const thumbnailFilename = `thumb_${uniqueFilename}`;
        const thumbnailPath = join(process.cwd(), 'public', 'images', 'packages', 'thumbnails', thumbnailFilename);
        
        // Ensure thumbnails directory exists
        await mkdir(join(process.cwd(), 'public', 'images', 'packages', 'thumbnails'), { recursive: true });
        
        // For now, copy the same file as thumbnail (in production, you'd resize it)
        await writeFile(thumbnailPath, file.data);
        
        uploadedFiles.push({
          originalName: file.filename,
          filename: uniqueFilename,
          thumbnail: thumbnailFilename,
          path: `/images/packages/imported/${uniqueFilename}`,
          thumbnailPath: `/images/packages/thumbnails/${thumbnailFilename}`,
          size: file.data.length,
          type: file.type || 'image/jpeg'
        });
      }
    }

    return {
      success: true,
      message: 'Images uploaded successfully',
      files: uploadedFiles
    };

  } catch (error: any) {
    console.error('Error uploading images:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload images'
    });
  }
});
