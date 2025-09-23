<template>
  <div class="min-h-screen bg-gray-50">
    <!-- محتوى الصفحة -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الصفحة...</span>
    </div>

    <div v-else-if="page" class="max-w-6xl mx-auto p-6">
      <!-- مكونات الصفحة -->
      <div class="space-y-6">
        <div v-if="page.components && page.components.length > 0">
          <div v-for="(component, index) in page.components" :key="component.id || index" class="mb-6">
            <component
              :is="getComponentName(component.type)"
              v-bind="component.props"
              :class="component.classes"
            />
          </div>
        </div>
        
        <!-- محتوى نصي إذا لم تكن هناك مكونات -->
        <div v-else-if="page.content_ar || page.content_en" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="prose max-w-none" v-html="page.content_ar || page.content_en"></div>
        </div>
        
        <!-- رسالة فارغة -->
        <div v-else class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Icon name="material-symbols:article" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">لا يوجد محتوى</h3>
          <p class="text-gray-500">هذه الصفحة لا تحتوي على أي محتوى</p>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود الصفحة -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:article" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الصفحة غير موجودة</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الصفحة المطلوبة</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        العودة للرئيسية
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
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
    const response = await $fetch(`/api/public/pages/${pageId}`)
    
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
    image: 'CMSImage'
  }
  return componentMap[type] || 'CMSGeneric'
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPage()
})

// SEO والميتا
useHead({
  title: computed(() => page.value ? page.value.title_ar || page.value.title : 'الصفحة'),
  meta: [
    { name: 'description', content: computed(() => page.value?.content_ar || page.value?.content_en || '') }
  ]
})
</script>
