export default defineEventHandler(() => {
  return {
    message: 'Hello from Vercel!',
    timestamp: new Date().toISOString(),
    status: 'working'
  }
})
