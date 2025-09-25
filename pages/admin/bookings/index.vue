<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <AdminPageHeader 
      title="إدارة الحجوزات"
      description="عرض وإدارة حجوزات العملاء"
    >
      <template #actions>
        <button
          @click="exportBookings"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:download" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">تصدير البيانات</span>
          <span class="sm:hidden">تصدير</span>
        </button>
        <NuxtLink
          to="/admin/bookings/create"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:add" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">إضافة حجز جديد</span>
          <span class="sm:hidden">إضافة</span>
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <!-- إحصائيات سريعة -->
    <AdminStats :stats="bookingStats" />

    <!-- شريط البحث والتصفية -->
    <AdminFilters>
      <AdminSearchInput
        v-model="searchQuery"
        placeholder="البحث في الحجوزات..."
      />
      <AdminSelect
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="جميع الحالات"
      />
      <AdminSelect
        v-model="paymentFilter"
        :options="paymentOptions"
        placeholder="جميع أنواع الدفع"
      />
      <AdminSelect
        v-model="dateFilter"
        :options="dateOptions"
        placeholder="جميع التواريخ"
      />
    </AdminFilters>

    <!-- قائمة الحجوزات -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الحجوزات...</span>
      </div>

      <!-- قائمة الحجوزات -->
      <div v-else-if="filteredBookings.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحجز
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العميل
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الباقة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الحجز
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50">
              <!-- معلومات الحجز -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon name="material-symbols:book-online" class="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">#{{ booking.booking_number || booking.id }}</div>
                    <div class="text-sm text-gray-500">{{ booking.adults + booking.children }} أشخاص</div>
                  </div>
                </div>
              </td>

              <!-- معلومات العميل -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ booking.customer_name }}</div>
                <div class="text-sm text-gray-500">{{ booking.customer_email }}</div>
                <div class="text-sm text-gray-500">{{ booking.customer_phone }}</div>
              </td>

              <!-- الباقة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ booking.package_title }}</div>
                <div class="text-sm text-gray-500">{{ booking.travel_date }}</div>
              </td>

              <!-- الحالة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(booking.status) }}
                </span>
                <div v-if="booking.payment_status" class="mt-1">
                  <span :class="getPaymentStatusColor(booking.payment_status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getPaymentStatusName(booking.payment_status) }}
                  </span>
                </div>
              </td>

              <!-- المبلغ -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatPrice(booking.total_amount) }}</div>
                <div class="text-sm text-gray-500">{{ booking.currency || 'SAR' }}</div>
              </td>

              <!-- تاريخ الحجز -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(booking.created_at) }}
              </td>

              <!-- الإجراءات -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <NuxtLink
                    :to="`/admin/bookings/${booking.id}`"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="عرض"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/bookings/${booking.id}/edit`"
                    class="text-green-600 hover:text-green-900 p-1 rounded"
                    title="تحرير"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="deleteBooking(booking)"
                    class="text-red-600 hover:text-red-900 p-1 rounded"
                    title="حذف"
                  >
                    <Icon name="material-symbols:delete" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-else class="text-center py-12">
        <Icon name="material-symbols:book-online" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد حجوزات</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي حجوزات</p>
        <NuxtLink
          to="/admin/bookings/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة حجز جديد
        </NuxtLink>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} حجز
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
const bookings = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// المتغيرات المحسوبة
const filteredBookings = computed(() => {
  let filtered = bookings.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(booking => 
      booking.customer_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.customer_email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.booking_number?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.package_title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  // تصفية الدفع
  if (paymentFilter.value) {
    filtered = filtered.filter(booking => booking.payment_status === paymentFilter.value)
  }

  // تصفية التاريخ
  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(booking => {
      const bookingDate = new Date(booking.created_at)
      switch (dateFilter.value) {
        case 'today':
          return bookingDate >= today
        case 'week':
          return bookingDate >= weekAgo
        case 'month':
          return bookingDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = bookings.value

  if (searchQuery.value) {
    filtered = filtered.filter(booking => 
      booking.customer_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.customer_email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.booking_number?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.package_title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  if (paymentFilter.value) {
    filtered = filtered.filter(booking => booking.payment_status === paymentFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(booking => {
      const bookingDate = new Date(booking.created_at)
      switch (dateFilter.value) {
        case 'today':
          return bookingDate >= today
        case 'week':
          return bookingDate >= weekAgo
        case 'month':
          return bookingDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// إحصائيات
const totalBookings = computed(() => bookings.value.length)
const confirmedBookings = computed(() => bookings.value.filter(booking => booking.status === 'confirmed').length)
const pendingBookings = computed(() => bookings.value.filter(booking => booking.status === 'pending').length)
const cancelledBookings = computed(() => bookings.value.filter(booking => booking.status === 'cancelled').length)
const totalRevenue = computed(() => bookings.value.reduce((sum, booking) => sum + (booking.total_amount || 0), 0))

// إحصائيات الحجوزات
const bookingStats = computed(() => [
  {
    key: 'total',
    label: 'إجمالي الحجوزات',
    value: totalBookings.value,
    icon: 'material-symbols:book-online',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    key: 'confirmed',
    label: 'مؤكدة',
    value: confirmedBookings.value,
    icon: 'material-symbols:check-circle',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    key: 'pending',
    label: 'في الانتظار',
    value: pendingBookings.value,
    icon: 'material-symbols:schedule',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    key: 'cancelled',
    label: 'ملغية',
    value: cancelledBookings.value,
    icon: 'material-symbols:cancel',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    key: 'revenue',
    label: 'إجمالي المبيعات',
    value: formatPrice(totalRevenue.value),
    icon: 'material-symbols:attach-money',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])

// خيارات التصفية
const statusOptions = computed(() => [
  { value: 'confirmed', label: 'مؤكدة' },
  { value: 'pending', label: 'في الانتظار' },
  { value: 'cancelled', label: 'ملغية' },
  { value: 'completed', label: 'مكتملة' }
])

const paymentOptions = computed(() => [
  { value: 'paid', label: 'مدفوع' },
  { value: 'pending', label: 'في الانتظار' },
  { value: 'failed', label: 'فشل' }
])

const dateOptions = computed(() => [
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' }
])

// تحميل الحجوزات
const loadBookings = async () => {
  try {
    loading.value = true
    const result = await $fetch('/api/bookings')
    bookings.value = result?.bookings || result || []
  } catch (error) {
    console.error('خطأ في تحميل الحجوزات:', error)
    // بيانات وهمية للعرض
    bookings.value = [
      {
        id: 1,
        booking_number: 'BK001',
        customer_name: 'أحمد محمد',
        customer_email: 'ahmed@example.com',
        customer_phone: '+966501234567',
        package_title: 'رحلة إلى دبي',
        travel_date: '2024-02-15',
        adults: 2,
        children: 1,
        status: 'confirmed',
        payment_status: 'paid',
        total_amount: 7500,
        currency: 'SAR',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        booking_number: 'BK002',
        customer_name: 'فاطمة علي',
        customer_email: 'fatima@example.com',
        customer_phone: '+966507654321',
        package_title: 'عمرة رمضان',
        travel_date: '2024-03-01',
        adults: 1,
        children: 0,
        status: 'pending',
        payment_status: 'pending',
        total_amount: 1800,
        currency: 'SAR',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}


// حذف الحجز
const deleteBooking = async (booking) => {
  if (!confirm('هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
    
    // Remove from local list
    bookings.value = bookings.value.filter(b => b.id !== booking.id)
    
    console.log('تم حذف الحجز بنجاح')
  } catch (error) {
    console.error('خطأ في حذف الحجز:', error)
  }
}

// تصدير البيانات
const exportBookings = () => {
  try {
    const { exportBookingsToExcel } = useExcelExport()
    const success = exportBookingsToExcel(bookings.value)
    if (success) {
      console.log('تم تصدير الحجوزات بنجاح')
    } else {
      console.error('فشل في تصدير الحجوزات')
    }
  } catch (error) {
    console.error('خطأ في تصدير الحجوزات:', error)
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

const getStatusName = (status) => {
  const statuses = {
    confirmed: 'مؤكدة',
    pending: 'في الانتظار',
    cancelled: 'ملغية',
    completed: 'مكتملة'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusName = (status) => {
  const statuses = {
    paid: 'مدفوع',
    pending: 'في الانتظار',
    failed: 'فشل'
  }
  return statuses[status] || status
}

const getPaymentStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    failed: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, statusFilter, paymentFilter, dateFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadBookings()
})

// SEO والميتا
useHead({
  title: 'إدارة الحجوزات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'عرض وإدارة حجوزات العملاء' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
