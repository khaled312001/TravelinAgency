<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ page?.title_ar || page?.title_en || 'عرض الصفحة' }}</h1>
        <p class="mt-1 text-sm text-gray-600">عرض تفاصيل الصفحة</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/content/${page?.id}/edit`"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
          تعديل
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

    <!-- محتوى الصفحة -->
    <div v-else-if="page" class="space-y-6">
      <!-- معلومات أساسية -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">المعلومات الأساسية</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">العنوان بالعربية</label>
            <p class="text-gray-900">{{ page.title_ar || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">العنوان بالإنجليزية</label>
            <p class="text-gray-900">{{ page.title_en || 'غير محدد' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">النوع</label>
            <span :class="getTypeColor(page.type)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getTypeName(page.type) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <span :class="getStatusColor(page.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusName(page.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ الإنشاء</label>
            <p class="text-gray-900">{{ formatDate(page.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">آخر تحديث</label>
            <p class="text-gray-900">{{ formatDate(page.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- المحتوى -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">المحتوى</h2>
        
        <!-- المحتوى بالعربية -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-700 mb-2">المحتوى بالعربية</h3>
          <div class="prose max-w-none">
            <div v-html="page.content_ar || 'لا يوجد محتوى'" class="text-gray-900"></div>
          </div>
        </div>

        <!-- المحتوى بالإنجليزية -->
        <div>
          <h3 class="text-md font-medium text-gray-700 mb-2">المحتوى بالإنجليزية</h3>
          <div class="prose max-w-none">
            <div v-html="page.content_en || 'No content'" class="text-gray-900"></div>
          </div>
        </div>
      </div>

      <!-- إعدادات SEO -->
      <div v-if="page.meta_description_ar || page.meta_description_en" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">إعدادات SEO</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="page.meta_description_ar">
            <label class="block text-sm font-medium text-gray-700 mb-1">وصف الصفحة بالعربية</label>
            <p class="text-gray-900">{{ page.meta_description_ar }}</p>
          </div>
          <div v-if="page.meta_description_en">
            <label class="block text-sm font-medium text-gray-700 mb-1">وصف الصفحة بالإنجليزية</label>
            <p class="text-gray-900">{{ page.meta_description_en }}</p>
          </div>
        </div>
      </div>

      <!-- إجراءات سريعة -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">إجراءات سريعة</h2>
        <div class="flex flex-wrap gap-3">
          <button
            @click="toggleStatus"
            :class="page.status === 'published' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'"
            class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
          >
            <Icon :name="page.status === 'published' ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" class="h-4 w-4 ml-2" />
            {{ page.status === 'published' ? 'إلغاء النشر' : 'نشر' }}
          </button>
          <button
            @click="deletePage"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Icon name="material-symbols:delete" class="h-4 w-4 ml-2" />
            حذف الصفحة
          </button>
        </div>
      </div>
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

// تحميل الصفحة
const loadPage = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/content/${pageId}`)
    
    if (response.success && response.page) {
      page.value = response.page
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

// تغيير حالة الصفحة
const toggleStatus = async () => {
  try {
    const newStatus = page.value.status === 'published' ? 'draft' : 'published'
    
    const response = await $fetch(`/api/content/${pageId}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    if (response.success) {
      page.value.status = newStatus
      console.log(`تم ${newStatus === 'published' ? 'نشر' : 'إلغاء نشر'} الصفحة بنجاح`)
    }
  } catch (error) {
    console.error('خطأ في تغيير حالة الصفحة:', error)
  }
}

// حذف الصفحة
const deletePage = async () => {
  if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    const response = await $fetch(`/api/content/${pageId}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await navigateTo('/admin/content')
    }
  } catch (error) {
    console.error('خطأ في حذف الصفحة:', error)
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const getTypeName = (type) => {
  const types = {
    page: 'صفحة',
    post: 'مقال',
    news: 'أخبار'
  }
  return types[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    page: 'bg-blue-100 text-blue-800',
    post: 'bg-green-100 text-green-800',
    news: 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status) => {
  const statuses = {
    published: 'منشور',
    draft: 'مسودة',
    archived: 'مؤرشف'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-orange-100 text-orange-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPage()
})

// SEO والميتا
useHead({
  title: computed(() => page.value ? `${page.value.title_ar || page.value.title_en} - Wonder Land Admin` : 'عرض الصفحة - Wonder Land Admin'),
  meta: [
    { name: 'description', content: 'عرض تفاصيل الصفحة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
