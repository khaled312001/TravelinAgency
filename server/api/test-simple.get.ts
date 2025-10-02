export default defineEventHandler(() => {
  return { 
    message: 'Vercel deployment working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  }
})
