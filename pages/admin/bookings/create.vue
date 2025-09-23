<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة حجز جديد</h1>
        <p class="mt-1 text-sm text-gray-600">إنشاء حجز جديد للعميل</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/bookings"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- نموذج الإنشاء -->
    <form @submit.prevent="createBooking" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- العمود الرئيسي -->
          <div class="lg:col-span-2 space-y-6">
            <!-- معلومات العميل -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">اسم العميل *</label>
                  <input
                    v-model="form.customer_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <input
                    v-model="form.customer_email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                  <input
                    v-model="form.customer_phone"
                    type="tel"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+966501234567"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عدد الضيوف *</label>
                  <input
                    v-model.number="form.guests_count"
                    type="number"
                    min="1"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- تفاصيل الحزمة -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">تفاصيل الحزمة</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">اختيار الحزمة *</label>
                  <select
                    v-model="form.package_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="onPackageChange"
                  >
                    <option value="">اختر الحزمة</option>
                    <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                      {{ pkg.title_ar || pkg.title_en || pkg.title }} - {{ formatPrice(pkg.price) }}
                    </option>
                  </select>
                </div>
                <div v-if="selectedPackage">
                  <label class="block text-sm font-medium text-gray-700 mb-2">مدة الرحلة</label>
                  <input
                    :value="selectedPackage.duration_days + ' أيام'"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ المغادرة *</label>
                  <input
                    v-model="form.departure_date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ العودة</label>
                  <input
                    v-model="form.return_date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <!-- عرض تفاصيل الحزمة المختارة -->
              <div v-if="selectedPackage" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 class="text-sm font-medium text-blue-900 mb-2">تفاصيل الحزمة المختارة</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <span class="font-medium">العنوان:</span> {{ selectedPackage.title_ar || selectedPackage.title_en || selectedPackage.title }}
                  </div>
                  <div>
                    <span class="font-medium">السعر:</span> {{ formatPrice(selectedPackage.price) }}
                  </div>
                  <div>
                    <span class="font-medium">المدة:</span> {{ selectedPackage.duration_days }} أيام
                  </div>
                  <div>
                    <span class="font-medium">الوجهة:</span> {{ selectedPackage.location || selectedPackage.travel_period }}
                  </div>
                </div>
              </div>
            </div>

            <!-- تفاصيل الدفع -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">تفاصيل الدفع</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">المبلغ الإجمالي *</label>
                  <input
                    v-model.number="form.total_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">المبلغ المدفوع</label>
                  <input
                    v-model.number="form.paid_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                  <select
                    v-model="form.currency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                  <select
                    v-model="form.payment_method"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر طريقة الدفع</option>
                    <option value="cash">نقداً</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="online">دفع إلكتروني</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">مرجع الدفع</label>
                  <input
                    v-model="form.payment_reference"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رقم المرجع أو المعاملة"
                  />
                </div>
              </div>
            </div>

            <!-- طلبات خاصة وملاحظات -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">طلبات خاصة وملاحظات</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">طلبات خاصة</label>
                  <textarea
                    v-model="form.special_requests"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أي طلبات خاصة من العميل"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات إدارية</label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ملاحظات إدارية أو تفاصيل إضافية"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- العمود الجانبي -->
          <div class="space-y-6">
            <!-- حالة الحجز -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">حالة الحجز</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">حالة الحجز *</label>
                  <select
                    v-model="form.booking_status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="confirmed">مؤكدة</option>
                    <option value="cancelled">ملغية</option>
                    <option value="completed">مكتملة</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">حالة الدفع *</label>
                  <select
                    v-model="form.payment_status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="partial">مدفوع جزئياً</option>
                    <option value="paid">مدفوع بالكامل</option>
                    <option value="refunded">مسترد</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ملخص الحجز -->
            <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">ملخص الحجز</h3>
              <div class="space-y-2 text-sm text-blue-800">
                <div class="flex justify-between">
                  <span>العميل:</span>
                  <span>{{ form.customer_name || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>عدد الضيوف:</span>
                  <span>{{ form.guests_count || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span>تاريخ المغادرة:</span>
                  <span>{{ form.departure_date || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>المبلغ الإجمالي:</span>
                  <span>{{ formatPrice(form.total_amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>المبلغ المدفوع:</span>
                  <span>{{ formatPrice(form.paid_amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>المتبقي:</span>
                  <span>{{ formatPrice(form.total_amount - form.paid_amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>حالة الحجز:</span>
                  <span>{{ getStatusName(form.booking_status) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>حالة الدفع:</span>
                  <span>{{ getPaymentStatusName(form.payment_status) }}</span>
                </div>
              </div>
            </div>

            <!-- معلومات إضافية -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">رقم الحجز</label>
                  <input
                    v-model="form.booking_number"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="سيتم إنشاؤه تلقائياً"
                  />
                  <p class="text-xs text-gray-500 mt-1">اتركه فارغاً لإنشاء رقم تلقائي</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ التأكيد</label>
                  <input
                    v-model="form.confirmed_at"
                    type="datetime-local"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <NuxtLink
            to="/admin/bookings"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving || !isFormValid"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2 inline" />
            {{ saving ? 'جاري الإنشاء...' : 'إنشاء الحجز' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const saving = ref(false)
const packages = ref([])
const selectedPackage = ref(null)

// نموذج البيانات
const form = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  package_id: '',
  guests_count: 1,
  departure_date: '',
  return_date: '',
  total_amount: 0,
  paid_amount: 0,
  currency: 'SAR',
  payment_method: '',
  payment_reference: '',
  booking_status: 'pending',
  payment_status: 'pending',
  special_requests: '',
  notes: '',
  booking_number: '',
  confirmed_at: ''
})

// التحقق من صحة النموذج
const isFormValid = computed(() => {
  return form.value.customer_name && 
         form.value.customer_email && 
         form.value.customer_phone &&
         form.value.package_id &&
         form.value.departure_date &&
         form.value.total_amount > 0
})

// تحميل الحزم
const loadPackages = async () => {
  try {
    const result = await $fetch('/api/packages')
    packages.value = result?.data || result || []
  } catch (error) {
    console.error('خطأ في تحميل الحزم:', error)
    packages.value = []
  }
}

// عند تغيير الحزمة
const onPackageChange = () => {
  selectedPackage.value = packages.value.find(pkg => pkg.id == form.value.package_id)
  if (selectedPackage.value) {
    // تحديث المبلغ الإجمالي بناءً على عدد الضيوف
    form.value.total_amount = selectedPackage.value.price * form.value.guests_count
    
    // تحديث تاريخ العودة بناءً على مدة الرحلة
    if (form.value.departure_date && selectedPackage.value.duration_days) {
      const departureDate = new Date(form.value.departure_date)
      const returnDate = new Date(departureDate)
      returnDate.setDate(returnDate.getDate() + selectedPackage.value.duration_days)
      form.value.return_date = returnDate.toISOString().split('T')[0]
    }
  }
}

// إنشاء الحجز
const createBooking = async () => {
  try {
    saving.value = true
    
    // تنظيف البيانات
    const bookingData = {
      ...form.value,
      // تحويل التواريخ إلى الصيغة المطلوبة
      departure_date: form.value.departure_date,
      return_date: form.value.return_date || null,
      confirmed_at: form.value.confirmed_at || null,
      // إنشاء رقم الحجز إذا لم يتم تحديده
      booking_number: form.value.booking_number || `BK${Date.now()}`,
      // تحويل package_id إلى رقم
      package_id: parseInt(form.value.package_id)
    }
    
    // إزالة الحقول الفارغة
    Object.keys(bookingData).forEach(key => {
      if (bookingData[key] === '' || bookingData[key] === null) {
        delete bookingData[key]
      }
    })
    
    const result = await $fetch('/api/bookings', {
      method: 'POST',
      body: bookingData
    })
    
    console.log('تم إنشاء الحجز بنجاح:', result)
    await navigateTo('/admin/bookings')
  } catch (error) {
    console.error('خطأ في إنشاء الحجز:', error)
    // يمكن إضافة إشعار خطأ هنا
  } finally {
    saving.value = false
  }
}

// دوال المساعدة
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

const getPaymentStatusName = (status) => {
  const statuses = {
    paid: 'مدفوع',
    partial: 'مدفوع جزئياً',
    pending: 'في الانتظار',
    refunded: 'مسترد'
  }
  return statuses[status] || status
}

// مراقبة تغيير عدد الضيوف لتحديث المبلغ
watch(() => form.value.guests_count, () => {
  if (selectedPackage.value) {
    form.value.total_amount = selectedPackage.value.price * form.value.guests_count
  }
})

// مراقبة تغيير تاريخ المغادرة لتحديث تاريخ العودة
watch(() => form.value.departure_date, () => {
  if (form.value.departure_date && selectedPackage.value?.duration_days) {
    const departureDate = new Date(form.value.departure_date)
    const returnDate = new Date(departureDate)
    returnDate.setDate(returnDate.getDate() + selectedPackage.value.duration_days)
    form.value.return_date = returnDate.toISOString().split('T')[0]
  }
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPackages()
})

// SEO والميتا
useHead({
  title: 'إضافة حجز جديد - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إنشاء حجز جديد للعميل' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
