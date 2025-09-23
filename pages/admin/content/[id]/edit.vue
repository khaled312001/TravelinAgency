<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تعديل الصفحة</h1>
        <p class="mt-1 text-sm text-gray-600">تعديل محتوى الصفحة</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/content/${pageId}`"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:visibility" class="h-5 w-5 ml-2" />
          عرض
        </NuxtLink>
        <NuxtLink
          to="/admin/content"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة للقائمة
        </NuxtLink>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الصفحة...</span>
    </div>

    <!-- نموذج التعديل -->
    <div v-else-if="page" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <form @submit.prevent="updatePage" class="p-6 space-y-6">
        <!-- معلومات أساسية -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- العنوان بالعربية -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              العنوان بالعربية *
            </label>
            <input
              v-model="form.title_ar"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل العنوان بالعربية"
            />
          </div>

          <!-- العنوان بالإنجليزية -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              العنوان بالإنجليزية *
            </label>
            <input
              v-model="form.title_en"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter title in English"
            />
          </div>
        </div>

        <!-- النوع والحالة -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- النوع -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              نوع المحتوى *
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر النوع</option>
              <option value="page">صفحة</option>
              <option value="post">مقال</option>
              <option value="news">أخبار</option>
            </select>
          </div>

          <!-- الحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              الحالة *
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>
        </div>

        <!-- المحتوى بالعربية -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            المحتوى بالعربية *
          </label>
          <WYSIWYGEditor
            v-model="form.content_ar"
            placeholder="أدخل المحتوى بالعربية"
          />
        </div>

        <!-- المحتوى بالإنجليزية -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            المحتوى بالإنجليزية *
          </label>
          <WYSIWYGEditor
            v-model="form.content_en"
            placeholder="Enter content in English"
          />
        </div>

        <!-- SEO -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">إعدادات SEO</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Meta Description بالعربية -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                وصف الصفحة بالعربية
              </label>
              <textarea
                v-model="form.meta_description_ar"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف مختصر للصفحة بالعربية"
              ></textarea>
            </div>

            <!-- Meta Description بالإنجليزية -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                وصف الصفحة بالإنجليزية
              </label>
              <textarea
                v-model="form.meta_description_en"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief page description in English"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex items-center justify-end space-x-3 space-x-reverse pt-6 border-t">
          <NuxtLink
            :to="`/admin/content/${pageId}`"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2" />
            {{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </button>
        </div>
      </form>
    </div>

    <!-- حالة عدم وجود الصفحة -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:article" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الصفحة غير موجودة</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الصفحة المطلوبة</p>
      <NuxtLink
        to="/admin/content"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        العودة للقائمة
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

// الحصول على معرف الصفحة
const route = useRoute()
const pageId = route.params.id

// المتغيرات التفاعلية
const page = ref(null)
const loading = ref(true)
const saving = ref(false)

// نموذج البيانات
const form = ref({
  title_ar: '',
  title_en: '',
  content_ar: '',
  content_en: '',
  type: '',
  status: 'draft',
  meta_description_ar: '',
  meta_description_en: ''
})

// تحميل الصفحة
const loadPage = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/content/${pageId}`)
    
    if (response.success && response.page) {
      page.value = response.page
      // ملء النموذج بالبيانات الحالية
      form.value = {
        title_ar: page.value.title_ar || '',
        title_en: page.value.title_en || '',
        content_ar: page.value.content_ar || '',
        content_en: page.value.content_en || '',
        type: page.value.type || '',
        status: page.value.status || 'draft',
        meta_description_ar: page.value.meta_description_ar || '',
        meta_description_en: page.value.meta_description_en || ''
      }
    } else {
      page.value = null
    }
  } catch (error) {
    console.error('خطأ في تحميل الصفحة:', error)
    page.value = null
  } finally {
    loading.value = false
  }
}

// تحديث الصفحة
const updatePage = async () => {
  try {
    saving.value = true
    
    const response = await $fetch(`/api/content/${pageId}`, {
      method: 'PUT',
      body: form.value
    })
    
    if (response.success) {
      // إعادة توجيه إلى صفحة العرض
      await navigateTo(`/admin/content/${pageId}`)
    } else {
      console.error('خطأ في تحديث الصفحة:', response.error)
    }
  } catch (error) {
    console.error('خطأ في تحديث الصفحة:', error)
  } finally {
    saving.value = false
  }
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPage()
})

// SEO والميتا
useHead({
  title: computed(() => page.value ? `تعديل ${page.value.title_ar || page.value.title_en} - Wonder Land Admin` : 'تعديل الصفحة - Wonder Land Admin'),
  meta: [
    { name: 'description', content: 'تعديل محتوى الصفحة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
