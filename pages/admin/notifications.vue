<template>
  <div class="space-y-6">
    <!-- رأس الصفحة -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">الإشعارات</h1>
        <p class="text-gray-600 mt-1">إدارة جميع الإشعارات والتنبيهات</p>
      </div>
      <div class="flex items-center space-x-3 space-x-reverse">
        <button
          @click="refreshNotifications"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          <Icon 
            name="material-symbols:refresh" 
            class="h-4 w-4 ml-2"
            :class="{ 'animate-spin': isLoading }"
          />
          تحديث
        </button>
        <button
          v-if="totalUnread > 0"
          @click="markAllAsRead"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          تعيين الكل كمقروء
        </button>
      </div>
    </div>

    <!-- إحصائيات الإشعارات -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="material-symbols:mail-outline" class="h-5 w-5 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">رسائل التواصل</p>
            <p class="text-2xl font-bold text-gray-900">{{ getNotificationCount('contact') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="material-symbols:package-2-outline" class="h-5 w-5 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">استفسارات الباقات</p>
            <p class="text-2xl font-bold text-gray-900">{{ getNotificationCount('package') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="material-symbols:location-on-outline" class="h-5 w-5 text-purple-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">استفسارات الوجهات</p>
            <p class="text-2xl font-bold text-gray-900">{{ getNotificationCount('destination') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="material-symbols:book-online-outline" class="h-5 w-5 text-orange-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">الحجوزات الجديدة</p>
            <p class="text-2xl font-bold text-gray-900">{{ getNotificationCount('booking') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- قائمة الإشعارات -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">جميع الإشعارات</h2>
      </div>

      <div v-if="isLoading" class="p-8 text-center">
        <Icon name="material-symbols:refresh" class="h-8 w-8 animate-spin mx-auto text-gray-400" />
        <p class="text-gray-500 mt-2">جاري تحميل الإشعارات...</p>
      </div>

      <div v-else-if="notifications.length === 0" class="p-8 text-center">
        <Icon name="material-symbols:notifications-none" class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="text-lg font-medium text-gray-900 mt-4">لا توجد إشعارات</h3>
        <p class="text-gray-500 mt-2">ستظهر الإشعارات الجديدة هنا عند وصولها</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="notification in notifications"
          :key="`${notification.type}-${notification.id}`"
          class="p-6 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50': !notification.is_read }"
        >
          <div class="flex items-start space-x-4 space-x-reverse">
            <!-- أيقونة الإشعار -->
            <div class="flex-shrink-0">
              <div 
                class="h-10 w-10 rounded-full flex items-center justify-center"
                :class="getNotificationColor(notification.type).replace('text-', 'bg-').replace('-600', '-100')"
              >
                <Icon 
                  :name="getNotificationIcon(notification.type)" 
                  class="h-5 w-5"
                  :class="getNotificationColor(notification.type)"
                />
              </div>
            </div>

            <!-- محتوى الإشعار -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ notification.title }}
                </h3>
                <div class="flex items-center space-x-3 space-x-reverse">
                  <span class="text-sm text-gray-500">
                    {{ formatNotificationTime(notification.created_at) }}
                  </span>
                  <div 
                    v-if="!notification.is_read"
                    class="h-2 w-2 bg-blue-500 rounded-full"
                  ></div>
                  <button
                    v-if="!notification.is_read"
                    @click="markAsRead(notification.id, notification.type)"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    تعيين كمقروء
                  </button>
                </div>
              </div>
              
              <p class="text-gray-600 mt-1">
                {{ notification.description }}
              </p>
              
              <div class="mt-3 flex items-center text-sm text-gray-500 space-x-4 space-x-reverse">
                <span class="flex items-center">
                  <Icon name="material-symbols:person-outline" class="h-4 w-4 ml-1" />
                  {{ notification.name }}
                </span>
                <span class="flex items-center">
                  <Icon name="material-symbols:mail-outline" class="h-4 w-4 ml-1" />
                  {{ notification.email }}
                </span>
                <span class="flex items-center">
                  <Icon name="material-symbols:phone-outline" class="h-4 w-4 ml-1" />
                  {{ notification.phone }}
                </span>
              </div>

              <div v-if="notification.message" class="mt-3 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-700">{{ notification.message }}</p>
              </div>

              <!-- أزرار الإجراءات -->
              <div class="mt-4 flex items-center space-x-3 space-x-reverse">
                <button
                  @click="navigateToNotification(notification)"
                  class="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  عرض التفاصيل
                </button>
                <button
                  v-if="notification.type === 'contact'"
                  @click="replyToContact(notification)"
                  class="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                >
                  الرد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminNotification } from '~/types/notifications';

// تحديد layout الإدارة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

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

// تحميل الإشعارات عند تحميل الصفحة
onMounted(() => {
  fetchNotifications();
});

// دالة تحديث الإشعارات
const refreshNotifications = async () => {
  await fetchNotifications();
};

// دالة الحصول على عدد الإشعارات حسب النوع
const getNotificationCount = (type: string) => {
  return notifications.value.filter(n => n.type === type && !n.is_read).length;
};

// دالة التنقل إلى الإشعار
const navigateToNotification = (notification: AdminNotification) => {
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
    navigateTo(route);
  }
};

// دالة الرد على رسالة التواصل
const replyToContact = (notification: AdminNotification) => {
  // يمكن إضافة منطق الرد هنا
  console.log('Reply to contact:', notification);
  // يمكن فتح نافذة الرد أو التنقل إلى صفحة الرد
};

// تحديث الإشعارات كل 30 ثانية
let refreshInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  refreshInterval = setInterval(() => {
    fetchNotifications();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
