<template>
  <div class="relative" ref="notificationRef">
    <!-- زر الإشعارات -->
    <button
      @click="notificationOpen = !notificationOpen"
      class="p-2 rounded-full text-white hover:text-pink-100 hover:bg-pink-400/30 transition-all duration-200 relative"
      :class="{ 'bg-pink-400/20': notificationOpen }"
    >
      <Icon name="material-symbols:notifications-outline" class="h-6 w-6" />
      <!-- شارة الإشعارات -->
      <span 
        v-if="totalUnread > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse"
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
        class="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden backdrop-blur-sm"
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
              class="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200"
              :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-blue-500': !notification.is_read }"
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

<script setup>
// المتغيرات التفاعلية
const notificationOpen = ref(false)
const notificationRef = ref(null)
const isLoading = ref(false)

// Message counter and notifications
const { unreadCount, fetchMessageCounts } = useMessageCounter()
const { startNotificationSystem, stopNotificationSystem } = useNotificationSystem()

// الإشعارات الحقيقية
const notifications = ref([])

// حساب الإشعارات غير المقروءة
const totalUnread = computed(() => {
  return notifications.value.filter(n => n.status === 'new').length
})

// إغلاق القائمة عند النقر خارجها
onClickOutside(notificationRef, () => {
  notificationOpen.value = false
})

// تحميل الإشعارات عند فتح القائمة
watch(notificationOpen, async (isOpen) => {
  if (isOpen) {
    await loadNotifications()
  }
})

// تهيئة النظام عند تحميل المكون
onMounted(async () => {
  await loadNotifications()
  await fetchMessageCounts()
  
  // تحديث تلقائي كل 30 ثانية
  const interval = setInterval(async () => {
    await loadNotifications()
    await fetchMessageCounts()
  }, 30000)
  
  // تنظيف عند إلغاء تحميل المكون
  onUnmounted(() => {
    clearInterval(interval)
  })
})

// دالة تحميل الإشعارات الحقيقية
const loadNotifications = async () => {
  try {
    isLoading.value = true
    const response = await $fetch('/api/contact-messages')
    
    if (response && response.messages) {
      // تحويل الرسائل إلى إشعارات
      notifications.value = response.messages
        .filter(msg => msg.status === 'new') // فقط الرسائل غير المقروءة
        .slice(0, 10) // آخر 10 رسائل
        .map(msg => ({
          id: msg.id,
          type: msg.type === 'booking' ? 'booking' : 'contact',
          title: msg.type === 'booking' ? 'استفسار عن باقة' : 'رسالة جديدة',
          description: msg.message.length > 100 ? msg.message.substring(0, 100) + '...' : msg.message,
          name: msg.name,
          phone: msg.phone,
          email: msg.email,
          is_read: msg.is_read,
          status: msg.status,
          created_at: msg.created_at
        }))
    }
  } catch (error) {
    console.error('خطأ في تحميل الإشعارات:', error)
    notifications.value = []
  } finally {
    isLoading.value = false
  }
}

// دالة تحديث الإشعارات
const refreshNotifications = async () => {
  await loadNotifications()
  await fetchMessageCounts()
}

// دالة تعيين الكل كمقروء
const markAllAsRead = async () => {
  try {
    // Update in database
    const result = await $fetch('/api/contact-messages/mark-all-read', {
      method: 'PUT'
    })
    
    if (result.success) {
      // تعيين جميع الإشعارات كمقروءة محلياً
      notifications.value.forEach(notification => {
        notification.status = 'read'
        notification.is_read = true
      })
      
      // تحديث العداد
      const { fetchMessageCounts } = useMessageCounter()
      await fetchMessageCounts()
      
      // إعادة تحميل الإشعارات
      await loadNotifications()
      
      console.log(`تم تعيين ${result.affectedRows} إشعار كمقروء`)
    }
  } catch (error) {
    console.error('خطأ في تعيين الإشعارات كمقروءة:', error)
  }
}

// دالة الحصول على أيقونة الإشعار
const getNotificationIcon = (type) => {
  const icons = {
    contact: 'material-symbols:message',
    booking: 'material-symbols:event',
    package: 'material-symbols:luggage',
    destination: 'material-symbols:place'
  }
  return icons[type] || 'material-symbols:notifications'
}

// دالة الحصول على لون الإشعار
const getNotificationColor = (type) => {
  const colors = {
    contact: 'text-blue-600',
    booking: 'text-green-600',
    package: 'text-purple-600',
    destination: 'text-orange-600'
  }
  return colors[type] || 'text-gray-600'
}

// دالة تنسيق وقت الإشعار
const formatNotificationTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'الآن'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} دقيقة`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعة`
  return date.toLocaleDateString('ar-SA')
}

// دالة التعامل مع النقر على الإشعار
const handleNotificationClick = async (notification) => {
  // تعيين الإشعار كمقروء
  if (!notification.is_read) {
    try {
      // Update in database
      const result = await $fetch(`/api/contact-messages/${notification.id}`, {
        method: 'PUT',
        body: {
          is_read: true,
          status: 'read'
        }
      })
      
      if (result.success) {
        notification.status = 'read'
        notification.is_read = true
        
        // تحديث العداد
        const { fetchMessageCounts } = useMessageCounter()
        await fetchMessageCounts()
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الإشعار:', error)
    }
  }

  // التنقل إلى الصفحة المناسبة
  let route = ''
  switch (notification.type) {
    case 'contact':
    case 'booking':
      route = '/admin/contacts'
      break
    case 'package':
      route = '/admin/packages'
      break
    case 'destination':
      route = '/admin/destinations'
      break
  }

  if (route) {
    await navigateTo(route)
    notificationOpen.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
