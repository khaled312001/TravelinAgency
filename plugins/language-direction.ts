export default defineNuxtPlugin((nuxtApp) => {
  // Create a component to handle the language direction
  const DirectionHandler = defineComponent({
    name: 'DirectionHandler',
    setup() {
      const { locale } = useI18n()
      let previousLocale = ref<string | null>(null)
      const isDirectionChanging = ref(false)

      // Enhanced direction change with transitions
      const setDirection = (lang: string) => {
        const htmlElement = document.documentElement
        const prevLang = previousLocale.value
        
        // Skip if already in progress to prevent stacking transitions
        if (isDirectionChanging.value) return
        
        // Detect direction change
        const isLtrToRtl = prevLang === 'en-US' && lang === 'ar-SA'
        const isRtlToLtr = prevLang === 'ar-SA' && lang === 'en-US'
        
        // Only proceed with transition if we're changing direction
        if (!isLtrToRtl && !isRtlToLtr) {
          htmlElement.dir = lang == 'ar-SA' ? 'rtl' : 'ltr'
          htmlElement.lang = lang.split('-')[0]
          htmlElement.setAttribute('data-locale', lang)
          previousLocale.value = lang
          return
        }
        
        isDirectionChanging.value = true
        
        // Set data attributes for transitions
        if (isLtrToRtl) {
          htmlElement.setAttribute('data-direction-change', 'ltr-to-rtl')
        } else if (isRtlToLtr) {
          htmlElement.setAttribute('data-direction-change', 'rtl-to-ltr')
        }
        
        // Apply the direction change - slight delay helps with transition
        nextTick(() => {
          htmlElement.dir = lang === 'ar-SA' ? 'rtl' : 'ltr'
          htmlElement.lang = lang.split('-')[0]
          htmlElement.setAttribute('data-locale', lang)
          
          // Update previous locale for next change
          previousLocale.value = lang
          
          // Remove direction change attribute after transition
          setTimeout(() => {
            htmlElement.removeAttribute('data-direction-change')
            isDirectionChanging.value = false
          }, 600) // Slightly longer than the CSS transition
        })
      }

      // Watch for language changes
      watch(locale, (newLocale) => {
        setDirection(newLocale)
      }, { flush: 'post' })

      // Set initial direction on mount
      onMounted(() => {
        previousLocale.value = locale.value
        setDirection(locale.value)
      })

      return {}
    },
    // Add render function that returns null since this is a utility component with no UI
    render() {
      return null
    }
  })

  // Register the component
  nuxtApp.vueApp.component('DirectionHandler', DirectionHandler)
})
