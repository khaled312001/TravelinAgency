<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة الرسائل</h1>
        <p class="mt-1 text-sm text-gray-600">عرض وإدارة رسائل العملاء</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <button
          @click="markAllAsRead"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:mark-email-read" class="h-5 w-5 ml-2" />
          تعيين الكل كمقروء
        </button>
        <button
          @click="exportContacts"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:download" class="h-5 w-5 ml-2" />
          تصدير البيانات
        </button>
      </div>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:mail" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">إجمالي الرسائل</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalMessages }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="material-symbols:mark-email-read" class="h-6 w-6 text-green-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">مقروء</p>
            <p class="text-2xl font-bold text-gray-900">{{ readMessages }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <Icon name="material-symbols:mark-email-unread" class="h-6 w-6 text-orange-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">غير مقروء</p>
            <p class="text-2xl font-bold text-gray-900">{{ unreadMessages }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:today" class="h-6 w-6 text-purple-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">اليوم</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayMessages }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- شريط البحث والتصفية -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- البحث -->
        <div class="relative">
          <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في الرسائل..."
            class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- تصفية حسب النوع -->
        <select
          v-model="typeFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الأنواع</option>
          <option value="general">عام</option>
          <option value="package">حزمة سياحية</option>
          <option value="destination">وجهة</option>
          <option value="complaint">شكوى</option>
          <option value="suggestion">اقتراح</option>
        </select>

        <!-- تصفية حسب الحالة -->
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الحالات</option>
          <option value="read">مقروء</option>
          <option value="unread">غير مقروء</option>
        </select>

        <!-- تصفية حسب التاريخ -->
        <select
          v-model="dateFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع التواريخ</option>
          <option value="today">اليوم</option>
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
        </select>
      </div>
    </div>

    <!-- قائمة الرسائل -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الرسائل...</span>
      </div>

      <!-- قائمة الرسائل -->
      <div v-else-if="filteredMessages.length > 0" class="divide-y divide-gray-200">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id" 
          class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewMessage(message)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div :class="message.is_read ? 'bg-gray-100' : 'bg-blue-100'" class="p-2 rounded-full">
                  <Icon 
                    :name="message.is_read ? 'material-symbols:mark-email-read' : 'material-symbols:mark-email-unread'" 
                    :class="message.is_read ? 'text-gray-600' : 'text-blue-600'" 
                    class="h-5 w-5" 
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <h3 class="text-sm font-medium text-gray-900">{{ message.name }}</h3>
                    <span :class="getTypeColor(message.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getTypeName(message.type) }}
                    </span>
                    <span v-if="!message.is_read" class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      جديد
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ message.email }}</p>
                  <p class="text-sm text-gray-700 mt-2">{{ truncateText(message.message, 100) }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ formatDate(message.created_at) }}</p>
                <p class="text-xs text-gray-400">{{ formatTime(message.created_at) }}</p>
              </div>
              <div class="flex items-center space-x-1 space-x-reverse">
                <button
                  @click.stop="toggleReadStatus(message)"
                  :class="message.is_read ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                  class="p-1 rounded"
                  :title="message.is_read ? 'تعيين كغير مقروء' : 'تعيين كمقروء'"
                >
                  <Icon :name="message.is_read ? 'material-symbols:mark-email-unread' : 'material-symbols:mark-email-read'" class="h-4 w-4" />
                </button>
                <button
                  @click.stop="deleteMessage(message)"
                  class="text-red-600 hover:text-red-900 p-1 rounded"
                  title="حذف"
                >
                  <Icon name="material-symbols:delete" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-else class="text-center py-12">
        <Icon name="material-symbols:mail" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد رسائل</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي رسائل</p>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} رسالة
      </div>
      <div class="flex space-x-1 space-x-reverse">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        <span class="px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-md">
          {{ currentPage }}
        </span>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const messages = ref([])
const loading = ref(true)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// المتغيرات المحسوبة
const filteredMessages = computed(() => {
  let filtered = messages.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(msg => 
      msg.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // تصفية النوع
  if (typeFilter.value) {
    filtered = filtered.filter(msg => msg.type === typeFilter.value)
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(msg => 
      statusFilter.value === 'read' ? msg.is_read : !msg.is_read
    )
  }

  // تصفية التاريخ
  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(msg => {
      const msgDate = new Date(msg.created_at)
      switch (dateFilter.value) {
        case 'today':
          return msgDate >= today
        case 'week':
          return msgDate >= weekAgo
        case 'month':
          return msgDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = messages.value

  if (searchQuery.value) {
    filtered = filtered.filter(msg => 
      msg.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(msg => msg.type === typeFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(msg => 
      statusFilter.value === 'read' ? msg.is_read : !msg.is_read
    )
  }

  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(msg => {
      const msgDate = new Date(msg.created_at)
      switch (dateFilter.value) {
        case 'today':
          return msgDate >= today
        case 'week':
          return msgDate >= weekAgo
        case 'month':
          return msgDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// إحصائيات
const totalMessages = computed(() => messages.value.length)
const readMessages = computed(() => messages.value.filter(msg => msg.is_read).length)
const unreadMessages = computed(() => messages.value.filter(msg => !msg.is_read).length)
const todayMessages = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return messages.value.filter(msg => new Date(msg.created_at) >= today).length
})

// تحميل الرسائل
const loadMessages = async () => {
  try {
    loading.value = true
    const result = await $fetch('/api/contact-messages')
    
    if (result.messages) {
      messages.value = result.messages
    } else {
      messages.value = []
    }
  } catch (error) {
    console.error('خطأ في تحميل الرسائل:', error)
    // بيانات وهمية للعرض في حالة الخطأ
    messages.value = [
      {
        id: 1,
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        type: 'package',
        message: 'أريد الاستفسار عن الباقات السياحية المتاحة لتركيا',
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966507654321',
        type: 'general',
        message: 'شكراً لكم على الخدمة الممتازة',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

// عرض الرسالة
const viewMessage = (message) => {
  // TODO: Open message detail modal or navigate to detail page
  console.log('Viewing message:', message)
}

// تغيير حالة القراءة
const toggleReadStatus = async (message) => {
  try {
    const newStatus = !message.is_read
    
    // TODO: Add API endpoint for updating message status
    const index = messages.value.findIndex(m => m.id === message.id)
    if (index !== -1) {
      messages.value[index].is_read = newStatus
    }

    console.log(`تم ${newStatus ? 'تعيين' : 'إلغاء تعيين'} الرسالة كمقروءة`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الرسالة:', error)
  }
}

// حذف الرسالة
const deleteMessage = async (message) => {
  if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/contact-messages/${message.id}`, { method: 'DELETE' })
    
    // Remove from local list
    messages.value = messages.value.filter(m => m.id !== message.id)
    
    console.log('تم حذف الرسالة بنجاح')
  } catch (error) {
    console.error('خطأ في حذف الرسالة:', error)
  }
}

// تعيين الكل كمقروء
const markAllAsRead = async () => {
  try {
    // TODO: Add API endpoint for marking all as read
    messages.value.forEach(msg => {
      msg.is_read = true
    })
    
    console.log('تم تعيين جميع الرسائل كمقروءة')
  } catch (error) {
    console.error('خطأ في تعيين الرسائل كمقروءة:', error)
  }
}

// تصدير البيانات
const exportContacts = () => {
  // TODO: Implement CSV/Excel export
  console.log('Exporting contacts...')
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getTypeName = (type) => {
  const types = {
    general: 'عام',
    package: 'حزمة سياحية',
    destination: 'وجهة',
    complaint: 'شكوى',
    suggestion: 'اقتراح'
  }
  return types[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    general: 'bg-gray-100 text-gray-800',
    package: 'bg-blue-100 text-blue-800',
    destination: 'bg-green-100 text-green-800',
    complaint: 'bg-red-100 text-red-800',
    suggestion: 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, typeFilter, statusFilter, dateFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadMessages()
})

// SEO والميتا
useHead({
  title: 'إدارة الرسائل - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'عرض وإدارة رسائل العملاء' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>