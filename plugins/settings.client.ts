export default defineNuxtPlugin(async () => {
  const { loadSettings } = useSettings()
  
  try {
    // تحميل الإعدادات العامة عند تحميل الموقع
    await loadSettings(true)
  } catch (error) {
    console.error('Failed to load site settings:', error)
  }
})
