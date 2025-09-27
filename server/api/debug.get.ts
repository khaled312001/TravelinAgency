export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    return {
      status: 'success',
      message: 'Debug information',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      runtimeConfig: {
        hasDbHost: !!config.dbHost,
        hasDbUser: !!config.dbUser,
        hasDbPassword: !!config.dbPassword,
        hasDbName: !!config.dbName,
        hasJwtSecret: !!config.jwtSecret,
        publicSiteUrl: config.public?.siteUrl || 'not set'
      },
      environmentVariables: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        DB_HOST: process.env.DB_HOST ? 'set' : 'not set',
        DB_USER: process.env.DB_USER ? 'set' : 'not set',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'set' : 'not set',
        DB_NAME: process.env.DB_NAME ? 'set' : 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
        PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'not set'
      }
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