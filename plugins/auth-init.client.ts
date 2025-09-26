export default defineNuxtPlugin(async () => {
  // تهيئة المصادقة عند تحميل التطبيق
  const { checkAuth, user } = useAuth()
  
  // Check if we're on the login page to avoid unnecessary auth checks
  const route = useRoute()
  const isLoginPage = route.path === '/admin/login'
  
  if (!isLoginPage) {
    // Check if user data is already available from cookie
    if (user.value) {
      // User already authenticated, no need to check again
      return
    }
    
    // Check for token cookie first to avoid unnecessary API calls
    const tokenCookie = useCookie('auth-token')
    
    if (tokenCookie.value) {
      try {
        // التحقق من المصادقة عند تحميل التطبيق (silent mode to reduce console noise)
        await checkAuth(true)
        // Auth check completed successfully
      } catch (error: any) {
        // Only log if it's not a 401 error (which is expected for unauthenticated users)
        if (error.statusCode !== 401) {
          console.warn('Authentication check failed:', error.message)
        }
        // Clear invalid token silently
        tokenCookie.value = null
      }
    }
    // No token found - user is not authenticated (this is normal)
  }
  // On login page - skip auth initialization (this is expected behavior)
})
