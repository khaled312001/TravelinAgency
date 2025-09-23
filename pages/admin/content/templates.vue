<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">قوالب الصفحات</h1>
        <p class="mt-1 text-sm text-gray-600">اختر من مجموعة متنوعة من القوالب الجاهزة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/content"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- فئات القوالب -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="category in templateCategories"
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedCategory === category.id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <Icon :name="category.icon" class="h-4 w-4 ml-2" />
        {{ category.name }}
      </button>
    </div>

    <!-- قوالب الصفحات -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        @click="showTemplatePreview(template)"
      >
        <!-- معاينة القالب -->
        <div class="aspect-video bg-gray-100 relative overflow-hidden">
          <img
            :src="template.preview"
            :alt="template.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="material-symbols:visibility" class="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <!-- معلومات القالب -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ template.name }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
          
          <!-- مكونات القالب -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="comp in template.components"
              :key="comp"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {{ comp }}
            </span>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex space-x-2 space-x-reverse">
            <button
              @click.stop="showTemplatePreview(template)"
              class="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              معاينة
            </button>
            <button
              @click.stop="useTemplate(template)"
              class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              استخدام
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- نافذة معاينة القالب -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <!-- رأس المعاينة -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ previewTemplate?.name }}</h2>
            <p class="text-sm text-gray-600">{{ previewTemplate?.description }}</p>
          </div>
          <button
            @click="showPreview = false"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>

        <!-- معاينة القالب -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="max-w-2xl mx-auto">
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div class="aspect-video bg-gray-100">
                <img
                  :src="previewTemplate?.preview"
                  :alt="previewTemplate?.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- مكونات القالب -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">مكونات القالب</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="comp in previewTemplate?.components"
                  :key="comp"
                  class="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <Icon name="material-symbols:check-circle" class="h-5 w-5 text-green-600 ml-2" />
                  <span class="text-sm text-gray-700">{{ comp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200">
          <button
            @click="showPreview = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="useTemplate(previewTemplate)"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            استخدام هذا القالب
          </button>
        </div>
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
const selectedCategory = ref('all')
const showPreview = ref(false)
const previewTemplate = ref(null)

// فئات القوالب
const templateCategories = ref([
  { id: 'all', name: 'الكل', icon: 'material-symbols:apps' },
  { id: 'landing', name: 'صفحات الهبوط', icon: 'material-symbols:home' },
  { id: 'business', name: 'أعمال', icon: 'material-symbols:work' },
  { id: 'portfolio', name: 'معرض أعمال', icon: 'material-symbols:photo-library' },
  { id: 'blog', name: 'مدونة', icon: 'material-symbols:article' },
  { id: 'contact', name: 'تواصل', icon: 'material-symbols:contact-mail' }
])

// قوالب الصفحات
const templates = ref([
  {
    id: 1,
    name: 'صفحة هبوط سياحية',
    description: 'قالب مثالي لوكالات السفر والسياحة',
    category: 'landing',
    preview: '/images/templates/travel-landing.jpg',
    components: ['Hero', 'About', 'Services', 'Testimonials', 'Contact'],
    data: {
      hero: {
        title: 'اكتشف العالم معنا',
        subtitle: 'أفضل الرحلات السياحية والحج والعمرة',
        backgroundImage: '/images/hero-bg.jpg',
        buttonText: 'اكتشف الآن',
        buttonLink: '/packages'
      },
      about: {
        title: 'من نحن',
        content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية...',
        image: '/images/about.jpg'
      },
      services: {
        title: 'خدماتنا',
        services: 'حج وعمرة\nرحلات سياحية\nتذاكر طيران\nحجز فنادق'
      }
    }
  },
  {
    id: 2,
    name: 'صفحة أعمال احترافية',
    description: 'قالب أنيق للشركات والمؤسسات',
    category: 'business',
    preview: '/images/templates/business.jpg',
    components: ['Hero', 'About', 'Services', 'Team', 'Contact'],
    data: {
      hero: {
        title: 'حلول أعمال متطورة',
        subtitle: 'نقدم أفضل الخدمات لتنمية أعمالك',
        backgroundImage: '/images/business-hero.jpg',
        buttonText: 'تعرف علينا',
        buttonLink: '/about'
      }
    }
  },
  {
    id: 3,
    name: 'معرض أعمال',
    description: 'عرض مشاريعك وأعمالك بطريقة احترافية',
    category: 'portfolio',
    preview: '/images/templates/portfolio.jpg',
    components: ['Hero', 'Portfolio', 'About', 'Contact'],
    data: {
      hero: {
        title: 'معرض أعمالنا',
        subtitle: 'اكتشف مشاريعنا المتميزة',
        backgroundImage: '/images/portfolio-hero.jpg',
        buttonText: 'شاهد الأعمال',
        buttonLink: '#portfolio'
      }
    }
  },
  {
    id: 4,
    name: 'صفحة مدونة',
    description: 'قالب مثالي للمدونات والمقالات',
    category: 'blog',
    preview: '/images/templates/blog.jpg',
    components: ['Hero', 'Blog Posts', 'Sidebar', 'Contact'],
    data: {
      hero: {
        title: 'مدونتنا',
        subtitle: 'أحدث المقالات والأخبار',
        backgroundImage: '/images/blog-hero.jpg',
        buttonText: 'اقرأ المزيد',
        buttonLink: '#posts'
      }
    }
  },
  {
    id: 5,
    name: 'صفحة تواصل',
    description: 'صفحة تواصل شاملة مع نموذج اتصال',
    category: 'contact',
    preview: '/images/templates/contact.jpg',
    components: ['Hero', 'Contact Form', 'Map', 'Info'],
    data: {
      hero: {
        title: 'تواصل معنا',
        subtitle: 'نحن هنا لمساعدتك',
        backgroundImage: '/images/contact-hero.jpg',
        buttonText: 'راسلنا',
        buttonLink: '#contact'
      }
    }
  },
  {
    id: 6,
    name: 'صفحة خدمات',
    description: 'عرض خدماتك بطريقة جذابة',
    category: 'business',
    preview: '/images/templates/services.jpg',
    components: ['Hero', 'Services', 'Pricing', 'Testimonials'],
    data: {
      hero: {
        title: 'خدماتنا',
        subtitle: 'نقدم أفضل الحلول لاحتياجاتك',
        backgroundImage: '/images/services-hero.jpg',
        buttonText: 'اطلب خدمة',
        buttonLink: '#services'
      }
    }
  }
])

// القوالب المفلترة
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return templates.value
  }
  return templates.value.filter(template => template.category === selectedCategory.value)
})

// دوال الإجراءات
const showTemplatePreview = (template) => {
  previewTemplate.value = template
  showPreview.value = true
}

const useTemplate = async (template) => {
  try {
    // إنشاء مكونات من بيانات القالب
    const components = []
    
    // تحويل بيانات القالب إلى مكونات
    if (template.data.hero) {
      components.push({
        id: Date.now() + 1,
        type: 'hero',
        props: template.data.hero,
        classes: 'mb-6'
      })
    }
    
    if (template.data.about) {
      components.push({
        id: Date.now() + 2,
        type: 'about',
        props: template.data.about,
        classes: 'mb-6'
      })
    }
    
    if (template.data.services) {
      components.push({
        id: Date.now() + 3,
        type: 'services',
        props: template.data.services,
        classes: 'mb-6'
      })
    }
    
    // إنشاء صفحة جديدة باستخدام القالب
    const newPage = {
      title_ar: template.name,
      title_en: template.name,
      content_ar: '',
      content_en: '',
      components: components,
      status: 'draft',
      template: template.id
    }

    // حفظ الصفحة في قاعدة البيانات
    const response = await $fetch('/api/cms/editor', {
      method: 'POST',
      body: newPage
    })
    
    if (response.success) {
      console.log('Page created with template:', response.id)
      // إعادة توجيه إلى محرر المحتوى مع الصفحة الجديدة
      await navigateTo(`/admin/content/editor?page=${response.id}`)
    }
  } catch (error) {
    console.error('Error using template:', error)
  }
}

// SEO والميتا
useHead({
  title: 'قوالب الصفحات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'اختر من مجموعة متنوعة من القوالب الجاهزة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
