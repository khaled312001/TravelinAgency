<template>
  <div class="min-h-screen bg-gray-50">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- شريط الأدوات -->
    <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4 space-x-reverse">
        <NuxtLink
          to="/admin/content"
          class="flex items-center text-gray-600 hover:text-gray-900"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة للإدارة
        </NuxtLink>
        <div class="h-6 w-px bg-gray-300"></div>
        <h1 class="text-lg font-semibold text-gray-900">معاينة الصفحة</h1>
      </div>
      
      <div class="flex items-center space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/content/editor?page=${pageId}`"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Icon name="material-symbols:design-services" class="h-4 w-4 ml-2" />
          محرر متقدم
        </NuxtLink>
        <NuxtLink
          :to="`/admin/content/${pageId}/edit`"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4 ml-2" />
          تحرير أساسي
        </NuxtLink>
        <button
          @click="refreshPage"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <Icon name="material-symbols:refresh" class="h-4 w-4 ml-2" />
          تحديث
        </button>
      </div>
    </div>

    <!-- محتوى الصفحة -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الصفحة...</span>
    </div>

    <div v-else-if="page" class="max-w-6xl mx-auto p-6">
      <!-- معلومات الصفحة -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ page.title_ar || page.title_en || page.title }}</h1>
            <p class="text-sm text-gray-600 mt-1">
              الحالة: 
              <span :class="getStatusColor(page.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusName(page.status) }}
              </span>
            </p>
            <p v-if="page.url" class="text-sm text-gray-500 mt-1">
              الرابط: 
              <a :href="page.url" target="_blank" class="text-blue-600 hover:text-blue-800 font-mono">
                {{ page.url }}
              </a>
            </p>
          </div>
          <div class="text-sm text-gray-500">
            آخر تحديث: {{ formatDate(page.updated_at) }}
          </div>
        </div>
      </div>

      <!-- مكونات الصفحة -->
      <div class="space-y-6">
        <div v-if="page.components && page.components.length > 0">
          <div class="text-gray-500 text-sm mb-4 p-3 bg-green-50 rounded-lg">
            <Icon name="material-symbols:check-circle" class="h-4 w-4 inline ml-1 text-green-600" />
            تم العثور على {{ page.components.length }} مكون في هذه الصفحة
          </div>
          <div v-for="(component, index) in page.components" :key="component.id || index" class="mb-6">
            <div class="border border-gray-200 rounded-lg p-4 bg-white">
              <div class="text-xs text-gray-500 mb-2 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                {{ component.type }}
              </div>
              <component
                :is="getComponentName(component.type)"
                v-bind="component.props"
                :class="component.classes"
              />
            </div>
          </div>
        </div>
        
        <!-- محتوى نصي إذا لم تكن هناك مكونات -->
        <div v-else-if="page.content_ar || page.content_en || page.content" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="prose max-w-none">
            <div class="text-gray-500 text-sm mb-4 p-3 bg-blue-50 rounded-lg">
              <Icon name="material-symbols:info" class="h-4 w-4 inline ml-1" />
              هذه معاينة للمحتوى النصي. لتحرير المكونات المتقدمة، استخدم المحرر المتقدم.
            </div>
            <div v-html="page.content_ar || page.content_en || page.content"></div>
          </div>
        </div>
        
        <!-- رسالة فارغة -->
        <div v-else class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Icon name="material-symbols:article" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">لا يوجد محتوى</h3>
          <p class="text-gray-500 mb-6">هذه الصفحة لا تحتوي على أي محتوى أو مكونات</p>
          <div class="flex justify-center space-x-3 space-x-reverse">
            <NuxtLink
              :to="`/admin/content/editor?page=${pageId}`"
              class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icon name="material-symbols:design-services" class="h-5 w-5 ml-2" />
              محرر متقدم
            </NuxtLink>
            <NuxtLink
              :to="`/admin/content/${pageId}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
              تحرير أساسي
            </NuxtLink>
          </div>
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
    const response = await $fetch(`/api/cms/editor/${pageId}`)
    
    if (response.success && response.page) {
      page.value = response.page
    } else {
      page.value = null
    }
  } catch (error) {
    console.error('Error loading page:', error)
    page.value = null
  } finally {
    loading.value = false
  }
}

// تحديث الصفحة
const refreshPage = () => {
  loadPage()
}

// الحصول على اسم المكون
const getComponentName = (type) => {
  const componentMap = {
    hero: 'CMSHero',
    about: 'CMSAbout',
    services: 'CMSServices',
    testimonials: 'CMSTestimonials',
    contact: 'CMSContact',
    heading: 'CMSHeading',
    paragraph: 'CMSParagraph',
    image: 'CMSImage',
    navigation: 'CMSNavigation',
    footer: 'CMSFooter'
  }
  return componentMap[type] || 'CMSGeneric'
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
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
  title: computed(() => page.value ? `معاينة ${page.value.title_ar || page.value.title} - Wonder Land Admin` : 'معاينة الصفحة - Wonder Land Admin'),
  meta: [
    { name: 'description', content: 'معاينة الصفحة قبل النشر' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
