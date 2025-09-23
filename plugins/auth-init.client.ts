export default defineNuxtPlugin(async () => {
  // تهيئة المصادقة عند تحميل التطبيق
  const { checkAuth } = useAuth()
  
  try {
    // التحقق من المصادقة عند تحميل التطبيق
    await checkAuth()
    console.log('🚀 Auth initialization completed')
  } catch (error) {
    console.log('⚠️ Auth initialization failed:', error)
  }
})
