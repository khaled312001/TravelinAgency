<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :duration="notification.duration"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<script setup>
// Import components
import Notification from '~/components/ui/Notification.vue'

const notifications = ref([])

const addNotification = (notification) => {
  const id = Date.now() + Math.random()
  notifications.value.push({
    id,
    type: notification.type || 'info',
    title: notification.title,
    message: notification.message || '',
    duration: notification.duration || 5000
  })
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// تصدير الدوال للاستخدام في التطبيق
defineExpose({
  addNotification,
  removeNotification
})

// توفير الدوال عبر provide/inject
provide('notifications', {
  addNotification,
  removeNotification
})
</script>
