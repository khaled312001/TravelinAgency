import { defineEventHandler, readBody, createError } from 'h3';
import { executeQuery } from '~/utils/database';

// POST /api/package-contact-form - Create new package contact message
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, and message are required'
      });
    }

    // Try to insert into database
    try {
      const result = await executeQuery(`
        INSERT INTO contact_messages (
          name,
          email,
          phone,
          subject,
          message,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        body.name,
        body.email,
        body.phone || '',
        body.packageName ? `استفسار عن الباقة: ${body.packageName}` : 'استفسار عن باقة سياحية',
        body.message
      ]);

      // Get the created message
      const newMessages = await executeQuery(`
        SELECT 
          id, 
          name,
          email,
          phone,
          subject,
          message,
          status,
          created_at,
          updated_at
        FROM contact_messages 
        WHERE id = ?
      `, [result.insertId]);

      if (!newMessages || newMessages.length === 0) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to retrieve created message'
        });
      }

      const messageData = newMessages[0];

      return {
        success: true,
        message: 'Package contact message sent successfully',
        data: {
          id: messageData.id,
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone,
          subject: messageData.subject,
          message: messageData.message,
          status: messageData.status,
          created_at: messageData.created_at
        }
      };

    } catch (dbError) {
      console.log('Database insert failed:', dbError);
      
      // Fallback: Store in local file
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const messagesFile = path.join(process.cwd(), 'public', 'package-contact-messages.json');
        
        let messages = [];
        if (fs.existsSync(messagesFile)) {
          const data = fs.readFileSync(messagesFile, 'utf8');
          messages = JSON.parse(data);
        }
        
        const newMessage = {
          id: Date.now(),
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          subject: body.packageName ? `استفسار عن الباقة: ${body.packageName}` : 'استفسار عن باقة سياحية',
          message: body.message,
          packageId: body.packageId,
          packageName: body.packageName,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        messages.push(newMessage);
        
        // Write back to file
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
        
        return {
          success: true,
          message: 'Package contact message sent successfully (stored locally)',
          data: newMessage
        };
        
      } catch (localError) {
        console.log('Local file storage failed:', localError);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to store package contact message'
        });
      }
    }

  } catch (error: any) {
    console.error('Error creating package contact message:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send package contact message'
    });
  }
});
