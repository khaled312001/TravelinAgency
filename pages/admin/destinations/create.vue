<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة وجهة جديدة</h1>
        <p class="mt-1 text-sm text-gray-600">إضافة وجهة سياحية جديدة إلى النظام</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/destinations"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة للقائمة
        </NuxtLink>
      </div>
    </div>

    <!-- نموذج إضافة الوجهة -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="createDestination" class="space-y-6">
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
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon v-if="loading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
            {{ loading ? 'جاري الحفظ...' : 'حفظ الوجهة' }}
          </button>
        </div>
      </form>
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

// المتغيرات التفاعلية
const loading = ref(false)
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

// إنشاء الوجهة
const createDestination = async () => {
  const { showSuccess, showError, showWarning } = useNotifications()
  
  try {
    loading.value = true
    
    // التحقق من صحة البيانات
    if (!form.value.name_ar || !form.value.name_en || !form.value.description_ar || !form.value.description_en) {
      showWarning('حقول مطلوبة', 'يرجى ملء جميع الحقول المطلوبة')
      return
    }
    
    const result = await $fetch('/api/destinations', {
      method: 'POST',
      body: form.value
    })
    
    if (result.success) {
      showSuccess('تم الإنشاء بنجاح', 'تم إنشاء الوجهة بنجاح!')
      // إعادة التوجيه إلى قائمة الوجهات
      await navigateTo('/admin/destinations')
    } else {
      showError('فشل في الإنشاء', 'فشل في إنشاء الوجهة. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error('خطأ في إنشاء الوجهة:', error)
    showError('خطأ في الإنشاء', 'حدث خطأ في إنشاء الوجهة. يرجى المحاولة مرة أخرى.')
  } finally {
    loading.value = false
  }
}

// SEO والميتا
useHead({
  title: 'إضافة وجهة جديدة - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إضافة وجهة سياحية جديدة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>