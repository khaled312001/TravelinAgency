export default defineEventHandler(async (event) => {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST ? '[SET]' : '[MISSING]',
      DB_PORT: process.env.DB_PORT ? '[SET]' : '[MISSING]',
      DB_USER: process.env.DB_USER ? '[SET]' : '[MISSING]',
      DB_PASSWORD: process.env.DB_PASSWORD ? '[SET]' : '[MISSING]',
      DB_NAME: process.env.DB_NAME ? '[SET]' : '[MISSING]',
      JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[MISSING]',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL ? '[SET]' : '[MISSING]'
    }

    // Test database connection
    let dbStatus = 'not_tested'
    let dbError = null
    
    try {
      const { executeQuery } = await import('~/utils/database')
      await executeQuery('SELECT 1 as test')
      dbStatus = 'connected'
    } catch (error: any) {
      dbStatus = 'failed'
      dbError = {
        message: error.message,
        code: error.code,
        errno: error.errno
      }
    }

    return {
      status: 'debug_info',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError
      },
      runtime: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    }
  } catch (error: any) {
    return {
      status: 'debug_error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack
      }
    }
  }
})
