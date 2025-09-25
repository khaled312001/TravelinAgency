export const useNotifications = () => {
  const notifications = inject('notifications', null)

  const showSuccess = (title: string, message?: string, duration?: number) => {
    if (notifications) {
      notifications.addNotification({
        type: 'success',
        title,
        message,
        duration
      })
    }
  }

  const showError = (title: string, message?: string, duration?: number) => {
    if (notifications) {
      notifications.addNotification({
        type: 'error',
        title,
        message,
        duration
      })
    }
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    if (notifications) {
      notifications.addNotification({
        type: 'warning',
        title,
        message,
        duration
      })
    }
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    if (notifications) {
      notifications.addNotification({
        type: 'info',
        title,
        message,
        duration
      })
    }
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}