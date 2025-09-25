export default defineNuxtPlugin(async () => {
  // تهيئة المصادقة عند تحميل التطبيق
  const { checkAuth, user } = useAuth()
  
  // Check if we're on the login page to avoid unnecessary auth checks
  const route = useRoute()
  const isLoginPage = route.path === '/admin/login'
  
  if (!isLoginPage) {
    // Check if user data is already available from cookie
    if (user.value) {
      console.log('🚀 Auth initialization - user data already available from cookie (v2.5)')
      return
    }
    
    // Check for token cookie first to avoid unnecessary API calls
    const tokenCookie = useCookie('auth-token')
    
    if (tokenCookie.value) {
      try {
        // التحقق من المصادقة عند تحميل التطبيق (silent mode to reduce console noise)
        await checkAuth(true)
        console.log('🚀 Auth initialization completed (v2.5)')
      } catch (error: any) {
        // Only log if it's not a 401 error (which is expected for unauthenticated users)
        if (error.statusCode !== 401) {
          console.log('⚠️ Auth initialization failed:', error)
        } else {
          console.log('🚀 Auth initialization - invalid token found (v2.5)')
        }
      }
    } else {
      console.log('🚀 Auth initialization skipped - no token found (v2.5)')
    }
  } else {
    console.log('🚀 Auth initialization skipped on login page (v2.5)')
  }
})
