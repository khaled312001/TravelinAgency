export const useNotificationSystem = () => {
  const { playNewMessageSound } = useSoundNotifications()
  
  let notificationInterval: NodeJS.Timeout | null = null
  let lastMessageCount = 0
  let hasPlayedSound = false

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification')
      return false
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return Notification.permission === 'granted'
  }

  const showDesktopNotification = (title: string, message: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'new-message', // This prevents duplicate notifications
        requireInteraction: false,
        silent: false
      })
    }
  }

  const checkForNewMessages = async () => {
    try {
      const response = await $fetch('/api/contact-messages')
      if (response && response.messages) {
        const unreadMessages = response.messages.filter((msg: any) => msg.status === 'new')
        const currentCount = unreadMessages.length

        // If there are new messages and we haven't played sound yet
        if (currentCount > lastMessageCount && !hasPlayedSound) {
          // Show desktop notification
          showDesktopNotification(
            'رسائل جديدة!',
            `لديك ${currentCount - lastMessageCount} رسالة تواصل جديدة`,
            '/favicon.ico'
          )
          
          // Play sound only once
          playNewMessageSound()
          hasPlayedSound = true
        }

        // Reset sound flag when messages are read
        if (currentCount === 0) {
          hasPlayedSound = false
        }

        lastMessageCount = currentCount
        return currentCount
      }
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
    return 0
  }

  const startNotificationSystem = async (interval: number = 10000) => { // Check every 10 seconds
    // Request permission first
    await requestNotificationPermission()
    
    // Clear any existing interval
    if (notificationInterval) {
      clearInterval(notificationInterval)
    }

    // Initial check
    await checkForNewMessages()

    // Set up interval
    notificationInterval = setInterval(checkForNewMessages, interval)

    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval)
        notificationInterval = null
      }
    }
  }

  const stopNotificationSystem = () => {
    if (notificationInterval) {
      clearInterval(notificationInterval)
      notificationInterval = null
    }
  }

  const resetNotificationState = () => {
    hasPlayedSound = false
    lastMessageCount = 0
  }

  return {
    requestNotificationPermission,
    showDesktopNotification,
    checkForNewMessages,
    startNotificationSystem,
    stopNotificationSystem,
    resetNotificationState
  }
}
