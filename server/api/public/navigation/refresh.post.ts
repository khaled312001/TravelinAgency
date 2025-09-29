import { defineEventHandler } from 'h3';

// POST /api/public/navigation/refresh - Force refresh navigation cache
export default defineEventHandler(async (event) => {
  try {
    // This endpoint can be called to force refresh navigation
    // It will return the latest navigation data
    
    let menu_name = 'main'
    try {
      const body = await readBody(event)
      if (body && typeof body === 'object' && body.menu_name) {
        menu_name = body.menu_name
      }
    } catch (error) {
      // Use default menu_name if body reading fails
      // console.log('Using default menu_name: main')
    }
    
    // console.log('🔄 Force refreshing navigation for menu:', menu_name)
    
    // Call the navigation API internally to get fresh data
    const navigationResponse = await $fetch('/api/public/navigation', {
      query: { menu_name }
    })
    
    // console.log('✅ Navigation refreshed successfully')
    
    return {
      success: true,
      message: 'Navigation refreshed successfully',
      data: navigationResponse.data,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('Error refreshing navigation:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to refresh navigation'
    })
  }
})
