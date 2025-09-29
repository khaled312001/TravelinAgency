export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: 'development'
  }
})
