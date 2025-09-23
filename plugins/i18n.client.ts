export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Run this immediately
    const savedLocale = localStorage.getItem('selectedLocale') || 'ar-SA'
    
    // Force the correct URL if needed
    const currentPath = window.location.pathname
    
    // If we're on English route but saved locale is Arabic
    if (currentPath.startsWith('/en-US') && savedLocale === 'ar-SA') {
      // Remove the /en-US prefix to go to Arabic version
      const newPath = currentPath.replace(/^\/en-US/, '')
      window.location.pathname = newPath || '/'
      return
    }
    
    // If we're on Arabic route (no prefix) but saved locale is English
    if (!currentPath.startsWith('/en-US') && savedLocale === 'en-US') {
      // Add the /en-US prefix to go to English version
      window.location.pathname = '/en-US' + currentPath
      return
    }
    
    const { $i18n } = nuxtApp.vueApp.config.globalProperties
    
    // Set initial locale with type assertion to ensure it's a valid locale
    $i18n.locale = savedLocale as 'en-US' | 'ar-SA'
    
    // Listen for locale changes and save to localStorage
    watch(() => $i18n.locale, (newLocale) => {
      localStorage.setItem('selectedLocale', newLocale)
    })
  }
})
