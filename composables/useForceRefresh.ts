// Composable to force refresh the page
export const useForceRefresh = () => {
  const forceRefresh = () => {
    if (process.client) {
      // Force reload the page
      window.location.reload()
    }
  }

  const forceRefreshWithCache = () => {
    if (process.client) {
      // Force reload with cache bypass
      window.location.href = window.location.href + '?t=' + Date.now()
    }
  }

  return {
    forceRefresh,
    forceRefreshWithCache
  }
}
