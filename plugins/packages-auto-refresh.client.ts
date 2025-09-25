// Auto-refresh packages composable when the page/tab regains focus
export default defineNuxtPlugin(() => {
  if (process.client) {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Use $fetch instead of useAsyncData to avoid mounting issues
        $fetch('/api/packages').then((result: any) => {
          if (result.success) {
            console.log('🔄 Packages auto-refreshed on visibility change')
            // Trigger a custom event that components can listen to
            window.dispatchEvent(new CustomEvent('packages-refreshed', { 
              detail: result.data 
            }))
          }
        }).catch((error) => {
          console.error('Failed to auto-refresh packages:', error)
        })
      }
    })
  }
})
