export const useRealTimeNotifications = () => {
  const { playNotificationSound } = useSoundNotifications()
  
  // Check for new messages periodically
  const checkForNewMessages = async () => {
    try {
      const response = await $fetch('/api/contact-messages')
      if (response.messages && response.messages.length > 0) {
        // Check if there are unread messages
        const unreadMessages = response.messages.filter(msg => !msg.is_read)
        if (unreadMessages.length > 0) {
          playNotificationSound()
          
          // Show browser notification if permission is granted
          if (Notification.permission === 'granted') {
            new Notification('رسالة جديدة', {
              body: `لديك ${unreadMessages.length} رسالة جديدة`,
              icon: '/favicon.ico',
              tag: 'new-message'
            })
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (process.client && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }
      return Notification.permission === 'granted'
    }
    return false
  }

  // Start real-time checking
  const startRealTimeChecking = () => {
    if (process.client) {
      // Check every 30 seconds
      const interval = setInterval(checkForNewMessages, 30000)
      
      // Also check when page becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          checkForNewMessages()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Return cleanup function
      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }

  return {
    checkForNewMessages,
    requestNotificationPermission,
    startRealTimeChecking
  }
}
