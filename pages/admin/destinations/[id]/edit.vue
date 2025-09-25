<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تحرير الوجهة</h1>
        <p class="mt-1 text-sm text-gray-600">تحرير معلومات الوجهة السياحية</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/destinations/${destinationId}`"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:visibility" class="h-5 w-5 ml-2" />
          عرض
        </NuxtLink>
        <NuxtLink
          to="/admin/destinations"
          class="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة للقائمة
        </NuxtLink>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل بيانات الوجهة...</span>
    </div>

    <!-- نموذج تحرير الوجهة -->
    <div v-else-if="destination" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      
      <form @submit.prevent="updateDestination" class="space-y-6">
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

        <!-- أزرار الإجراءات -->
        <div class="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
          <NuxtLink
            to="/admin/destinations"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="updateLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon v-if="updateLoading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
            {{ updateLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </button>
        </div>
      </form>
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

// المتغيرات التفاعلية
const loading = ref(true)
const updateLoading = ref(false)
const destination = ref(null)
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
      
      // ملء النموذج بالبيانات الموجودة
      await nextTick()
      form.value = {
        name_ar: result.data.name_ar || '',
        name_en: result.data.name_en || '',
        description_ar: result.data.description_ar || '',
        description_en: result.data.description_en || '',
        category: result.data.category || 'international',
        image_url: result.data.image_url || result.data.image || '',
        active: result.data.active === 1 || result.data.active === true,
        featured: result.data.featured === 1 || result.data.featured === true
      }
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

// تحديث الوجهة
const updateDestination = async () => {
  const { showSuccess, showError, showWarning } = useNotifications()
  
  try {
    updateLoading.value = true
    
    // التحقق من صحة البيانات قبل الإرسال
    if (!form.value.name_ar || !form.value.name_en || !form.value.description_ar || !form.value.description_en) {
      showWarning('حقول مطلوبة', 'يرجى ملء جميع الحقول المطلوبة')
      return
    }
    
    const result = await $fetch(`/api/destinations/${destinationId}`, {
      method: 'PUT',
      body: form.value
    })
    
    if (result.success) {
      showSuccess('تم التحديث بنجاح', 'تم تحديث الوجهة بنجاح!')
      // إعادة التوجيه إلى صفحة عرض الوجهة
      await navigateTo(`/admin/destinations/${destinationId}`)
    } else {
      showError('فشل في التحديث', 'فشل في تحديث الوجهة. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error('خطأ في تحديث الوجهة:', error)
    showError('خطأ في التحديث', 'حدث خطأ في تحديث الوجهة. يرجى المحاولة مرة أخرى.')
  } finally {
    updateLoading.value = false
  }
}



// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadDestination()
})

// SEO والميتا
useHead({
  title: computed(() => `تحرير ${destination.value?.name_ar || 'الوجهة'} - Wonder Land Admin`),
  meta: [
    { name: 'description', content: 'تحرير معلومات الوجهة السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
