<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">عرض الحجز</h1>
        <p class="mt-1 text-sm text-gray-600">تفاصيل الحجز #{{ booking?.booking_number || bookingId }}</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/bookings/${bookingId}/edit`"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
          تحرير
        </NuxtLink>
        <NuxtLink
          to="/admin/bookings"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الحجز...</span>
    </div>

    <!-- تفاصيل الحجز -->
    <div v-else-if="booking" class="space-y-6">
      <!-- معلومات الحجز الأساسية -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">معلومات الحجز</h2>
          <div class="flex space-x-2 space-x-reverse">
            <span :class="getStatusColor(booking.booking_status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ getStatusName(booking.booking_status) }}
            </span>
            <span :class="getPaymentStatusColor(booking.payment_status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ getPaymentStatusName(booking.payment_status) }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">رقم الحجز</label>
            <p class="text-lg font-semibold text-gray-900">#{{ booking.booking_number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ الحجز</label>
            <p class="text-gray-900">{{ formatDate(booking.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">عدد الضيوف</label>
            <p class="text-gray-900">{{ booking.guests_count }} شخص</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ المغادرة</label>
            <p class="text-gray-900">{{ formatDate(booking.departure_date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ العودة</label>
            <p class="text-gray-900">{{ booking.return_date ? formatDate(booking.return_date) : 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ التأكيد</label>
            <p class="text-gray-900">{{ booking.confirmed_at ? formatDateTime(booking.confirmed_at) : 'غير مؤكد' }}</p>
          </div>
        </div>
      </div>

      <!-- معلومات العميل -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">الاسم</label>
            <p class="text-gray-900">{{ booking.customer_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
            <p class="text-gray-900">{{ booking.customer_email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">رقم الهاتف</label>
            <p class="text-gray-900">{{ booking.customer_phone }}</p>
          </div>
        </div>
      </div>

      <!-- تفاصيل الباقة -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">تفاصيل الباقة</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">اسم الباقة</label>
            <p class="text-gray-900">{{ booking.package?.title_ar || booking.package?.title_en || booking.package?.title || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">الوجهة</label>
            <p class="text-gray-900">{{ booking.package?.location || booking.package?.travel_period || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">مدة الرحلة</label>
            <p class="text-gray-900">{{ booking.package?.duration_days || 'غير محدد' }} أيام</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">سعر الباقة</label>
            <p class="text-gray-900">{{ formatPrice(booking.package?.price) }}</p>
          </div>
        </div>
      </div>

      <!-- تفاصيل الدفع -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">تفاصيل الدفع</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">المبلغ الإجمالي</label>
            <p class="text-lg font-semibold text-gray-900">{{ formatPrice(booking.total_amount) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">المبلغ المدفوع</label>
            <p class="text-lg font-semibold text-green-600">{{ formatPrice(booking.paid_amount) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">المبلغ المتبقي</label>
            <p class="text-lg font-semibold text-orange-600">{{ formatPrice(booking.total_amount - booking.paid_amount) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">العملة</label>
            <p class="text-gray-900">{{ booking.currency || 'SAR' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">طريقة الدفع</label>
            <p class="text-gray-900">{{ booking.payment_method || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">مرجع الدفع</label>
            <p class="text-gray-900">{{ booking.payment_reference || 'غير محدد' }}</p>
          </div>
        </div>
      </div>

      <!-- طلبات خاصة وملاحظات -->
      <div v-if="booking.special_requests || booking.notes" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">طلبات خاصة وملاحظات</h2>
        <div class="space-y-4">
          <div v-if="booking.special_requests">
            <label class="block text-sm font-medium text-gray-500 mb-1">طلبات خاصة</label>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ booking.special_requests }}</p>
          </div>
          <div v-if="booking.notes">
            <label class="block text-sm font-medium text-gray-500 mb-1">ملاحظات إدارية</label>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ booking.notes }}</p>
          </div>
        </div>
      </div>

      <!-- معلومات الإلغاء -->
      <div v-if="booking.booking_status === 'cancelled'" class="bg-red-50 rounded-lg border border-red-200 p-6">
        <h2 class="text-lg font-semibold text-red-900 mb-4">معلومات الإلغاء</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-red-700 mb-1">سبب الإلغاء</label>
            <p class="text-red-900">{{ booking.cancellation_reason || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-red-700 mb-1">تاريخ الإلغاء</label>
            <p class="text-red-900">{{ booking.cancellation_date ? formatDateTime(booking.cancellation_date) : 'غير محدد' }}</p>
          </div>
        </div>
      </div>

      <!-- معلومات إضافية -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ الإنشاء</label>
            <p class="text-gray-900">{{ formatDateTime(booking.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">آخر تحديث</label>
            <p class="text-gray-900">{{ formatDateTime(booking.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود الحجز -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:book-online" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الحجز غير موجود</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الحجز المطلوب</p>
      <NuxtLink
        to="/admin/bookings"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
        العودة إلى الحجوزات
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// الحصول على معرف الحجز من الرابط
const route = useRoute()
const bookingId = route.params.id

// المتغيرات التفاعلية
const loading = ref(true)
const booking = ref(null)

// تحميل بيانات الحجز
const loadBooking = async () => {
  try {
    loading.value = true
    const result = await $fetch(`/api/bookings/${bookingId}`)
    booking.value = result?.data || result
  } catch (error) {
    console.error('خطأ في تحميل الحجز:', error)
    booking.value = null
  } finally {
    loading.value = false
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleString('ar-SA')
}

const formatPrice = (price) => {
  if (!price) return '0.00 ر.س'
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
    partial: 'مدفوع جزئياً',
    pending: 'في الانتظار',
    refunded: 'مسترد'
  }
  return statuses[status] || status
}

const getPaymentStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    refunded: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadBooking()
})

// SEO والميتا
useHead({
  title: `عرض الحجز #${bookingId} - Wonder Land Admin`,
  meta: [
    { name: 'description', content: 'عرض تفاصيل الحجز' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
