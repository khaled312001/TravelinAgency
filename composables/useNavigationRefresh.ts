// Composable to force refresh navigation across all pages
export const useNavigationRefresh = () => {
  const refreshAllNavigation = async () => {
    try {
      // Clear navigation state
      const navigation = useState('cms.navigation', () => ({}))
      navigation.value = {}
      
      // Force refresh navigation
      const { refreshNavigation } = useCMS()
      await refreshNavigation('main')
      
      // Also refresh in all open tabs/windows
      if (process.client) {
        // Send message to all tabs to refresh navigation
        window.dispatchEvent(new CustomEvent('navigation-refresh'))
      }
      
      return true
    } catch (error) {
      console.error('Error refreshing all navigation:', error)
      return false
    }
  }

  const listenForNavigationRefresh = () => {
    if (process.client) {
      window.addEventListener('navigation-refresh', async () => {
        const { refreshNavigation } = useCMS()
        await refreshNavigation('main')
      })
    }
  }

  return {
    refreshAllNavigation,
    listenForNavigationRefresh
  }
}
