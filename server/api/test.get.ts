export default defineEventHandler(async (event) => {
  try {
    return {
      status: 'success',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    })
  }
})