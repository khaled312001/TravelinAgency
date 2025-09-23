export const useViewTransition = () => {
  const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document

  const startViewTransition = async (callback: () => Promise<void> | void, direction: 'forward' | 'backward' = 'forward', options: { isLocaleChange?: boolean } = {}) => {
    if (!isSupported) {
      await callback()
      return
    }

    // Set direction attribute for CSS animations
    document.documentElement.setAttribute('data-direction', direction)
    
    // Special handling for locale changes
    if (options.isLocaleChange) {
      document.documentElement.classList.add('locale-transitioning')
      
      try {
        await callback()
      } finally {
        // Remove the class after a short delay to allow the transition to complete
        setTimeout(() => {
          document.documentElement.classList.remove('locale-transitioning')
        }, 300)
      }
      return
    }

    return (document as any).startViewTransition(async () => {
      await callback()
      
      // Reset scroll position - skip this for locale changes
      if (!options.isLocaleChange) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  // Enhanced method for locale changes that's direction-aware
  const startLocaleTransition = async (callback: () => Promise<void> | void, fromLocale: string, toLocale: string) => {
    // Determine if we're going from LTR to RTL or vice versa
    const isRtlToLtr = fromLocale === 'ar-SA' && toLocale === 'en-US'
    const isLtrToRtl = fromLocale === 'en-US' && toLocale === 'ar-SA'
    
    // Set transition direction based on language change
    const transitionDirection = isLtrToRtl ? 'ltr-to-rtl' : 'rtl-to-ltr'
    document.documentElement.setAttribute('data-locale-transition', transitionDirection)
    
    // Prepare the DOM for transition by adding a class early
    document.documentElement.classList.add('locale-transitioning')
    
    // Brief delay to ensure CSS has applied before starting the transition
    await new Promise(resolve => setTimeout(resolve, 10))
    
    // Use native view transitions if supported
    if (isSupported) {
      try {
        return (document as any).startViewTransition(async () => {
          try {
            // Execute the callback (language change)
            await callback()
            
            // Give the DOM time to update with new language content
            await new Promise(resolve => setTimeout(resolve, 30))
          } catch (error) {
            console.error('Error during locale transition:', error)
          }
        })
      } finally {
        // Ensure we clean up the transition classes after animation completes
        setTimeout(() => {
          document.documentElement.classList.remove('locale-transitioning')
          document.documentElement.removeAttribute('data-locale-transition')
        }, 500) // Match this duration with CSS animation duration
      }
    } else {
      // Fallback for browsers without view transitions
      try {
        await callback()
      } finally {
        setTimeout(() => {
          document.documentElement.classList.remove('locale-transitioning')
          document.documentElement.removeAttribute('data-locale-transition')
        }, 500)
      }
    }
  }

  return {
    startViewTransition,
    startLocaleTransition,
    isSupported
  }
}
