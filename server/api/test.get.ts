export default defineEventHandler(async (event) => {
  return {
    message: 'Serverless function is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform
  }
})
