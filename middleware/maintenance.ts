export default defineNuxtRouteMiddleware(async (to) => {
  // تجاهل middleware في وضع التطوير
  if (process.dev) return
  
  // تجاهل صفحات الإدارة
  if (to.path.startsWith('/admin')) return
  
  try {
    const { getSetting } = useSettings()
    
    // التحقق من وضع الصيانة
    const maintenanceMode = getSetting('maintenance_mode', false)
    
    if (maintenanceMode) {
      // إعادة توجيه إلى صفحة الصيانة
      return navigateTo('/maintenance')
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
  }
})
