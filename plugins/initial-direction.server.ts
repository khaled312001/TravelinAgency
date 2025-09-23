// Use a Nuxt hook instead of a plugin for server-side rendering
export default defineNuxtPlugin(() => {
  // Use the app:rendered hook which runs during SSR
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('app:rendered', () => {
    // Get the current locale from the i18n config
    const currentLocale = nuxtApp.$i18n?.locale?.value || 'ar-SA'
    
    // Set the HTML attributes based on the locale
    if (process.server) {
      useHead({
        htmlAttrs: {
          lang: currentLocale === 'ar-SA' ? 'ar' : 'en',
          dir: currentLocale === 'ar-SA' ? 'rtl' : 'ltr'
        }
      })
    }
  })
})
