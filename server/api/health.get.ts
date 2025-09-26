import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/health - Health check endpoint
export default defineEventHandler(async (event) => {
  try {
    // Test database connection
    const result = await executeQuery('SELECT 1 as test');
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      config: {
        dbHost: process.env.DB_HOST ? '[SET]' : '[MISSING]',
        dbUser: process.env.DB_USER ? '[SET]' : '[MISSING]',
        dbName: process.env.DB_NAME ? '[SET]' : '[MISSING]',
        dbPassword: process.env.DB_PASSWORD ? '[SET]' : '[MISSING]'
      }
    };
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development',
      config: {
        dbHost: process.env.DB_HOST ? '[SET]' : '[MISSING]',
        dbUser: process.env.DB_USER ? '[SET]' : '[MISSING]',
        dbName: process.env.DB_NAME ? '[SET]' : '[MISSING]',
        dbPassword: process.env.DB_PASSWORD ? '[SET]' : '[MISSING]'
      }
    };
  }
});
