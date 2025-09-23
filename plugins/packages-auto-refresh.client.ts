// Auto-refresh packages composable when the page/tab regains focus
import { usePackages } from '~/composables/usePackages'

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const { refresh } = usePackages()
        refresh()
      }
    })
  }
})
