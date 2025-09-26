import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/images/upload-destination - Upload destination images
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      });
    }

    const file = formData[0];
    
    if (!file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      });
    }

    // التحقق من نوع الملف
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File must be an image'
      });
    }

    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size too large. Maximum 5MB allowed'
      });
    }

    const uploadDir = join(process.cwd(), 'public', 'images', 'destinations');
    
    // إنشاء مجلد الرفع إذا لم يكن موجوداً
    await mkdir(uploadDir, { recursive: true });

    // إنشاء اسم فريد للملف
    const fileExtension = extname(file.filename);
    const uniqueFilename = `dest_${uuidv4()}${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);
    
    // كتابة الملف على القرص
    await writeFile(filePath, file.data);
    
    // إرجاع معلومات الملف
    const fileInfo = {
      originalName: file.filename,
      filename: uniqueFilename,
      url: `/images/destinations/${uniqueFilename}`,
      size: file.data.length,
      type: file.type || 'image/jpeg'
    };

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: fileInfo
    };

  } catch (error: any) {
    console.error('Error uploading destination image:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image'
    });
  }
});
