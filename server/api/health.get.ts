export default defineEventHandler(async (event) => {
  try {
    // Basic health check without database connection
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Health check failed',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    })
  }
})