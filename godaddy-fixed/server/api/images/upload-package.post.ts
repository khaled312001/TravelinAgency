import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/images/upload-package - Upload package images
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      });
    }

    const file = formData.find(data => data.name === 'image');

    if (!file || !file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image file is missing or invalid'
      });
    }

    const uploadDir = join(process.cwd(), 'public', 'images', 'packages');
    await mkdir(uploadDir, { recursive: true });

    const fileExtension = extname(file.filename);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);

    await writeFile(filePath, file.data);

    const imageUrl = `/images/packages/${uniqueFilename}`;

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: { url: imageUrl }
    };

  } catch (error: any) {
    console.error('Error uploading package image:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to upload package image'
    });
  }
});
