<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تفاصيل الوجهة</h1>
        <p class="mt-1 text-sm text-gray-600">عرض تفاصيل الوجهة السياحية</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <!-- أزرار وضع العرض -->
        <template v-if="!isEditing">
          <button
            @click="enableEditMode"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
            تحرير
          </button>
          <NuxtLink
            to="/admin/destinations"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
            العودة للقائمة
          </NuxtLink>
        </template>
        
        <!-- أزرار وضع التعديل -->
        <template v-else>
          <button
            @click="saveChanges"
            :disabled="updateLoading"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon v-if="updateLoading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
            <Icon v-else name="material-symbols:save" class="h-5 w-5 ml-2" />
            {{ updateLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </button>
          <button
            @click="cancelEdit"
            :disabled="updateLoading"
            class="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="material-symbols:close" class="h-5 w-5 ml-2" />
            إلغاء
          </button>
        </template>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل بيانات الوجهة...</span>
    </div>

    <!-- تفاصيل الوجهة -->
    <div v-else-if="destination" class="space-y-6">
      <!-- البطاقة الرئيسية -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- صورة الوجهة -->
        <div v-if="destination.image_url || destination.image" class="h-64 bg-gray-100">
          <img
            :src="destination.image_url || destination.image"
            :alt="destination.name_ar || destination.name_en"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <!-- محتوى البطاقة -->
        <div class="p-6">
          <!-- وضع العرض -->
          <template v-if="!isEditing">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ destination.name_ar || destination.name_en }}
                </h2>
                <p v-if="destination.name_en && destination.name_ar" class="text-lg text-gray-600">
                  {{ destination.name_en }}
                </p>
              </div>
              <div class="flex space-x-2 space-x-reverse">
                <span :class="getStatusColor(destination.active ? 'active' : 'inactive')" class="px-3 py-1 text-sm font-medium rounded-full">
                  {{ getStatusName(destination.active ? 'active' : 'inactive') }}
                </span>
                <span v-if="destination.featured" class="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                  مميز
                </span>
              </div>
            </div>

            <!-- الوصف -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="destination.description_ar">
                  <h4 class="text-sm font-medium text-gray-700 mb-1">بالعربية</h4>
                  <p class="text-gray-600">{{ destination.description_ar }}</p>
                </div>
                <div v-if="destination.description_en">
                  <h4 class="text-sm font-medium text-gray-700 mb-1">بالإنجليزية</h4>
                  <p class="text-gray-600">{{ destination.description_en }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- وضع التعديل -->
          <template v-else>
            <form @submit.prevent="saveChanges" class="space-y-6">
              <!-- المعلومات الأساسية -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- الاسم بالعربية -->
                <div>
                  <label for="name_ar" class="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالعربية *
                  </label>
                  <input
                    id="name_ar"
                    v-model="form.name_ar"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم الوجهة بالعربية"
                  />
                </div>

                <!-- الاسم بالإنجليزية -->
                <div>
                  <label for="name_en" class="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإنجليزية *
                  </label>
                  <input
                    id="name_en"
                    v-model="form.name_en"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination name in English"
                  />
                </div>
              </div>

              <!-- الوصف -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- الوصف بالعربية -->
                <div>
                  <label for="description_ar" class="block text-sm font-medium text-gray-700 mb-2">
                    الوصف بالعربية *
                  </label>
                  <textarea
                    id="description_ar"
                    v-model="form.description_ar"
                    required
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل وصف الوجهة بالعربية"
                  ></textarea>
                </div>

                <!-- الوصف بالإنجليزية -->
                <div>
                  <label for="description_en" class="block text-sm font-medium text-gray-700 mb-2">
                    الوصف بالإنجليزية *
                  </label>
                  <textarea
                    id="description_en"
                    v-model="form.description_en"
                    required
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination description in English"
                  ></textarea>
                </div>
              </div>

              <!-- معلومات إضافية -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- نوع الوجهة -->
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                    نوع الوجهة *
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="international">عالمي</option>
                    <option value="saudi">سعودي</option>
                  </select>
                </div>

                <!-- صورة الوجهة -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    صورة الوجهة
                  </label>
                  <ImageUpload
                    v-model="form.image_url"
                    alt="صورة الوجهة"
                    @upload-complete="handleImageUploadComplete"
                    @upload-error="handleImageUploadError"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    يمكنك رفع صورة JPG, PNG, JPEG بحجم أقصى 5MB
                  </p>
                </div>

                <!-- حالة الوجهة -->
                <div>
                  <label for="active" class="block text-sm font-medium text-gray-700 mb-2">
                    حالة الوجهة
                  </label>
                  <select
                    id="active"
                    v-model="form.active"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option :value="true">نشط</option>
                    <option :value="false">غير نشط</option>
                  </select>
                </div>
              </div>

              <!-- خيارات إضافية -->
              <div class="flex items-center space-x-4 space-x-reverse">
                <label class="flex items-center">
                  <input
                    v-model="form.featured"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="mr-2 text-sm text-gray-700">وجهة مميزة</span>
                </label>
              </div>
            </form>
          </template>

          <!-- المعلومات الأساسية -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">نوع الوجهة</h4>
              <p class="text-gray-900">{{ getTypeName(destination.category) }}</p>
            </div>
            <div v-if="destination.region_ar || destination.region_en">
              <h4 class="text-sm font-medium text-gray-700 mb-1">المنطقة</h4>
              <p class="text-gray-900">{{ destination.region_ar || destination.region_en }}</p>
            </div>
            <div v-if="destination.location_type_ar || destination.location_type_en">
              <h4 class="text-sm font-medium text-gray-700 mb-1">نوع الموقع</h4>
              <p class="text-gray-900">{{ destination.location_type_ar || destination.location_type_en }}</p>
            </div>
            <div v-if="destination.destination_type_ar || destination.destination_type_en">
              <h4 class="text-sm font-medium text-gray-700 mb-1">نوع الوجهة</h4>
              <p class="text-gray-900">{{ destination.destination_type_ar || destination.destination_type_en }}</p>
            </div>
            <div v-if="destination.coordinates">
              <h4 class="text-sm font-medium text-gray-700 mb-1">الإحداثيات</h4>
              <p class="text-gray-900 text-sm">
                {{ getCoordinates(destination.coordinates) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- معلومات إضافية -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- معلومات النظام -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات النظام</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">معرف الوجهة</span>
              <span class="text-sm font-medium text-gray-900">{{ destination.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">تاريخ الإنشاء</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(destination.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">آخر تحديث</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(destination.updated_at) }}</span>
            </div>
          </div>
        </div>

        <!-- الإجراءات السريعة -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
          <div class="space-y-3">
            <button
              @click="toggleDestinationStatus"
              :class="destination.active ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-green-100 text-green-800 hover:bg-green-200'"
              class="w-full px-4 py-2 rounded-lg transition-colors"
            >
              {{ destination.active ? 'إلغاء التفعيل' : 'تفعيل الوجهة' }}
            </button>
            <button
              @click="deleteDestination"
              class="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              حذف الوجهة
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود الوجهة -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:place" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الوجهة غير موجودة</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الوجهة المطلوبة</p>
      <NuxtLink
        to="/admin/destinations"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        العودة للقائمة
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Import components
import ImageUpload from '~/components/ui/ImageUpload.vue'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// الحصول على معرف الوجهة من الرابط
const route = useRoute()
const destinationId = route.params.id


// تفعيل وضع التعديل
const enableEditMode = () => {
  isEditing.value = true
  
  // ملء النموذج بالبيانات الحالية
  if (destination.value) {
    form.value = {
      name_ar: destination.value.name_ar || '',
      name_en: destination.value.name_en || '',
      description_ar: destination.value.description_ar || '',
      description_en: destination.value.description_en || '',
      category: destination.value.category || 'international',
      image_url: destination.value.image_url || destination.value.image || '',
      active: destination.value.active === 1 || destination.value.active === true,
      featured: destination.value.featured === 1 || destination.value.featured === true
    }
  }
}

// إلغاء وضع التعديل
const cancelEdit = () => {
  isEditing.value = false
}

// معالجة رفع الصورة بنجاح
const handleImageUploadComplete = (fileInfo) => {
  const { showSuccess } = useNotifications()
  showSuccess('تم رفع الصورة', 'تم رفع الصورة بنجاح!')
}

// معالجة خطأ رفع الصورة
const handleImageUploadError = (error) => {
  const { showError } = useNotifications()
  showError('خطأ في رفع الصورة', error.message || 'حدث خطأ في رفع الصورة')
}

// حفظ التعديلات
const saveChanges = async () => {
  const { showSuccess, showError, showWarning } = useNotifications()
  
  try {
    updateLoading.value = true
    
    // التحقق من صحة البيانات
    if (!form.value.name_ar || !form.value.name_en || !form.value.description_ar || !form.value.description_en) {
      showWarning('حقول مطلوبة', 'يرجى ملء جميع الحقول المطلوبة')
      return
    }
    
    const result = await $fetch(`/api/destinations/${destinationId}`, {
      method: 'PUT',
      body: form.value
    })
    
    if (result.success) {
      // تحديث البيانات المحلية
      destination.value = result.data
      isEditing.value = false
      showSuccess('تم الحفظ بنجاح', 'تم حفظ التغييرات بنجاح!')
    } else {
      showError('فشل في الحفظ', 'فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error('خطأ في حفظ التغييرات:', error)
    showError('خطأ في الحفظ', 'حدث خطأ في حفظ التغييرات. يرجى المحاولة مرة أخرى.')
  } finally {
    updateLoading.value = false
  }
}

// المتغيرات التفاعلية
const loading = ref(true)
const destination = ref(null)
const isEditing = ref(false)
const updateLoading = ref(false)
const form = ref({
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  category: 'international',
  image_url: '',
  active: true,
  featured: false
})

// تحميل بيانات الوجهة
const loadDestination = async () => {
  const { showError } = useNotifications()
  
  try {
    loading.value = true
    const result = await $fetch(`/api/destinations/${destinationId}`)
    
    if (result.success && result.data) {
      destination.value = result.data
    } else {
      destination.value = null
    }
  } catch (error) {
    console.error('خطأ في تحميل بيانات الوجهة:', error)
    destination.value = null
    showError('خطأ في التحميل', 'حدث خطأ في تحميل بيانات الوجهة. يرجى المحاولة مرة أخرى.')
  } finally {
    loading.value = false
  }
}

// تغيير حالة الوجهة
const toggleDestinationStatus = async () => {
  const { showSuccess, showError } = useNotifications()
  
  if (!confirm(`هل أنت متأكد من ${destination.value.active ? 'إلغاء تفعيل' : 'تفعيل'} هذه الوجهة؟`)) return

  try {
    const newStatus = destination.value.active ? 'inactive' : 'active'
    const newActiveValue = destination.value.active ? 0 : 1
    
    await $fetch(`/api/destinations/${destinationId}`, {
      method: 'PUT',
      body: {
        ...destination.value,
        active: newActiveValue,
        status: newStatus
      }
    })
    
    destination.value.active = newActiveValue
    destination.value.status = newStatus
    
    showSuccess(
      'تم التحديث بنجاح', 
      `تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الوجهة بنجاح`
    )
  } catch (error) {
    console.error('خطأ في تغيير حالة الوجهة:', error)
    showError('خطأ في التحديث', 'حدث خطأ في تغيير حالة الوجهة. يرجى المحاولة مرة أخرى.')
  }
}

// حذف الوجهة
const deleteDestination = async () => {
  const { showSuccess, showError } = useNotifications()
  
  if (!confirm('هل أنت متأكد من حذف هذه الوجهة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/destinations/${destinationId}`, { method: 'DELETE' })
    showSuccess('تم الحذف بنجاح', 'تم حذف الوجهة بنجاح')
    await navigateTo('/admin/destinations')
  } catch (error) {
    console.error('خطأ في حذف الوجهة:', error)
    showError('خطأ في الحذف', 'حدث خطأ في حذف الوجهة. يرجى المحاولة مرة أخرى.')
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const getCoordinates = (coordinates) => {
  if (!coordinates) return ''
  
  try {
    // If it's already an object, use it directly
    if (typeof coordinates === 'object') {
      return `${coordinates.latitude}, ${coordinates.longitude}`
    }
    
    // If it's a string, try to parse it
    if (typeof coordinates === 'string') {
      const parsed = JSON.parse(coordinates)
      return `${parsed.latitude}, ${parsed.longitude}`
    }
    
    return ''
  } catch (error) {
    console.error('Error parsing coordinates:', error)
    return ''
  }
}

const getTypeName = (type) => {
  const types = {
    saudi: 'سعودي',
    international: 'عالمي'
  }
  return types[type] || type
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadDestination()
})

// SEO والميتا
useHead({
  title: computed(() => `تفاصيل ${destination.value?.name_ar || 'الوجهة'} - Wonder Land Admin`),
  meta: [
    { name: 'description', content: 'تفاصيل الوجهة السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
