<template>
  <div class="relative" ref="notificationRef">
    <!-- زر الإشعارات -->
    <button
      @click="notificationOpen = !notificationOpen"
      class="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
    >
      <Icon name="material-symbols:notifications-outline" class="h-6 w-6" />
      <!-- شارة الإشعارات -->
      <span 
        v-if="totalUnread > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
      >
        {{ totalUnread > 99 ? '99+' : totalUnread }}
      </span>
    </button>

    <!-- قائمة الإشعارات المنسدلة -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="notificationOpen"
        class="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
      >
        <!-- رأس القائمة -->
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">الإشعارات</h3>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              v-if="totalUnread > 0"
              @click="markAllAsRead"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              تعيين الكل كمقروء
            </button>
            <button
              @click="refreshNotifications"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              :disabled="isLoading"
            >
              <Icon 
                name="material-symbols:refresh" 
                class="h-4 w-4"
                :class="{ 'animate-spin': isLoading }"
              />
            </button>
          </div>
        </div>

        <!-- قائمة الإشعارات -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="isLoading" class="p-4 text-center">
            <Icon name="material-symbols:refresh" class="h-6 w-6 animate-spin mx-auto text-gray-400" />
            <p class="text-sm text-gray-500 mt-2">جاري تحميل الإشعارات...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="p-4 text-center">
            <Icon name="material-symbols:notifications-off" class="h-8 w-8 mx-auto text-gray-400" />
            <p class="text-sm text-gray-500 mt-2">لا توجد إشعارات جديدة</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="notification in notifications"
              :key="`${notification.type}-${notification.id}`"
              @click="handleNotificationClick(notification)"
              class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50': !notification.is_read }"
            >
              <div class="flex items-start space-x-3 space-x-reverse">
                <!-- أيقونة الإشعار -->
                <div class="flex-shrink-0">
                  <div 
                    class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="getNotificationColor(notification.type).replace('text-', 'bg-').replace('-600', '-100')"
                  >
                    <Icon 
                      :name="getNotificationIcon(notification.type)" 
                      class="h-4 w-4"
                      :class="getNotificationColor(notification.type)"
                    />
                  </div>
                </div>

                <!-- محتوى الإشعار -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ notification.title }}
                    </p>
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <span class="text-xs text-gray-500">
                        {{ formatNotificationTime(notification.created_at) }}
                      </span>
                      <div 
                        v-if="!notification.is_read"
                        class="h-2 w-2 bg-blue-500 rounded-full"
                      ></div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                    {{ notification.description }}
                  </p>
                  <div class="mt-2 flex items-center text-xs text-gray-500">
                    <span class="truncate">{{ notification.name }}</span>
                    <span class="mx-2">•</span>
                    <span class="truncate">{{ notification.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تذييل القائمة -->
        <div v-if="notifications.length > 0" class="px-4 py-3 border-t border-gray-200">
          <NuxtLink
            to="/admin/notifications"
            class="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            @click="notificationOpen = false"
          >
            عرض جميع الإشعارات
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { AdminNotification } from '~/types/notifications';

// المتغيرات التفاعلية
const notificationOpen = ref(false);
const notificationRef = ref(null);

// استخدام composable الإشعارات
const {
  notifications,
  totalUnread,
  isLoading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTime
} = useNotifications();

// إغلاق القائمة عند النقر خارجها
onClickOutside(notificationRef, () => {
  notificationOpen.value = false;
});

// تحميل الإشعارات عند فتح القائمة
watch(notificationOpen, (isOpen) => {
  if (isOpen) {
    fetchNotifications();
  }
});

// تحديث الإشعارات كل 30 ثانية
let refreshInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  // تحميل الإشعارات الأولي
  fetchNotifications();
  
  // إعداد التحديث التلقائي
  refreshInterval = setInterval(() => {
    if (notificationOpen.value) {
      fetchNotifications();
    }
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

// دالة تحديث الإشعارات
const refreshNotifications = async () => {
  await fetchNotifications();
};

// دالة التعامل مع النقر على الإشعار
const handleNotificationClick = async (notification: AdminNotification) => {
  // تعيين الإشعار كمقروء
  if (!notification.is_read) {
    await markAsRead(notification.id, notification.type);
  }

  // التنقل إلى الصفحة المناسبة
  let route = '';
  switch (notification.type) {
    case 'contact':
      route = '/admin/contacts';
      break;
    case 'package':
      route = '/admin/packages';
      break;
    case 'destination':
      route = '/admin/destinations';
      break;
    case 'booking':
      route = '/admin/bookings';
      break;
  }

  if (route) {
    await navigateTo(route);
    notificationOpen.value = false;
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
