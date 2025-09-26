export default defineEventHandler(async (event) => {
  try {
    // Test database connection
    const { executeQuery } = await import('~/utils/database')
    
    // Simple query to test connection
    await executeQuery('SELECT 1 as test')
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected'
    }
  } catch (error: any) {
    console.error('Health check failed:', error)
    
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'disconnected',
      error: {
        message: error.message,
        code: error.code
      }
    }
  }
})