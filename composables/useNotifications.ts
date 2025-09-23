import type { AdminNotification, NotificationResponse, MarkAsReadResponse } from '~/types/notifications';

export const useNotifications = () => {
  const notifications = ref<AdminNotification[]>([]);
  const totalUnread = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all notifications from the API
   */
  const fetchNotifications = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<NotificationResponse>('/api/admin/notifications');
      
      if (response.success) {
        notifications.value = response.data.notifications;
        totalUnread.value = response.data.totalUnread;
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      error.value = err.message || 'Failed to fetch notifications';
      notifications.value = [];
      totalUnread.value = 0;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Mark a specific notification as read
   */
  const markAsRead = async (notificationId: number, type: string) => {
    try {
      const response = await $fetch<MarkAsReadResponse>('/api/admin/notifications/read', {
        method: 'PUT',
        body: {
          notificationId,
          type
        }
      });

      if (response.success) {
        // Update local state
        const notification = notifications.value.find(n => n.id === notificationId);
        if (notification) {
          notification.is_read = true;
          totalUnread.value = Math.max(0, totalUnread.value - 1);
        }
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      const response = await $fetch<MarkAsReadResponse>('/api/admin/notifications/read-all', {
        method: 'PUT'
      });

      if (response.success) {
        // Update local state
        notifications.value.forEach(notification => {
          notification.is_read = true;
        });
        totalUnread.value = 0;
      }
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return 'material-symbols:mail-outline';
      case 'package':
        return 'material-symbols:package-2-outline';
      case 'destination':
        return 'material-symbols:location-on-outline';
      case 'booking':
        return 'material-symbols:book-online-outline';
      default:
        return 'material-symbols:notifications-outline';
    }
  };

  /**
   * Get notification color based on type
   */
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'text-blue-600';
      case 'package':
        return 'text-green-600';
      case 'destination':
        return 'text-purple-600';
      case 'booking':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * Format notification time
   */
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} يوم`;
    }
  };

  return {
    notifications: readonly(notifications),
    totalUnread: readonly(totalUnread),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime
  };
};
