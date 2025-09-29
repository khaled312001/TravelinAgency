<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">محرر المحتوى</h1>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <button
              @click="savePage"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2" />
              <Icon v-else name="material-symbols:save" class="h-4 w-4 ml-2" />
              {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
            </button>
            <button
              @click="publishPage"
              :disabled="saving"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2" />
              <Icon v-else name="material-symbols:publish" class="h-4 w-4 ml-2" />
              {{ saving ? 'جاري النشر...' : 'نشر' }}
            </button>
            <button
              @click="togglePreview"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Icon name="material-symbols:visibility" class="h-4 w-4 ml-2" />
              {{ previewMode ? 'تحرير' : 'معاينة' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Components Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">المكونات</h2>
            
            <!-- Search -->
            <div class="mb-4">
              <input
                v-model="componentSearch"
                type="text"
                placeholder="البحث في المكونات..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Component Categories -->
            <div class="space-y-4">
              <div v-for="category in filteredCategories" :key="category.name" class="space-y-2">
                <h3 class="text-sm font-medium text-gray-700">{{ category.name }}</h3>
                <div class="space-y-1">
                  <button
                    v-for="component in category.components"
                    :key="component.type"
                    @click="addComponent(component)"
                    class="w-full text-right px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <Icon :name="component.icon" class="h-4 w-4" />
                    {{ component.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Area -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
            
            <!-- Preview Mode -->
            <div v-if="previewMode" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">معاينة الصفحة</h2>
              <div class="prose max-w-none">
                <div v-for="(comp, index) in pageComponents" :key="index" class="mb-6">
                  <div class="text-center py-8 border border-gray-200 rounded-lg">
                    <p class="text-lg font-medium">{{ comp.type }}</p>
                    <p class="text-sm text-gray-500">مكون محمل من قاعدة البيانات</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">تحرير الصفحة</h2>
              
              <!-- Empty State -->
              <div v-if="pageComponents.length === 0" class="text-center py-12">
                <Icon name="material-symbols:add-box" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">ابدأ بإنشاء صفحتك</h3>
                <p class="text-gray-500 mb-6">اسحب المكونات من الشريط الجانبي لبدء التصميم</p>
                <button
                  @click="addDefaultComponents"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة مكونات افتراضية
                </button>
              </div>

              <!-- Components -->
              <div v-else class="space-y-4">
                <div v-for="(comp, index) in pageComponents" :key="index" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-medium text-gray-900">{{ comp.type }}</h4>
                    <div class="flex space-x-2 space-x-reverse">
                      <button
                        @click="moveComponent(index, 'up')"
                        :disabled="index === 0"
                        class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="نقل لأعلى"
                      >
                        <Icon name="material-symbols:keyboard-arrow-up" class="h-4 w-4" />
                      </button>
                      <button
                        @click="moveComponent(index, 'down')"
                        :disabled="index === pageComponents.length - 1"
                        class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="نقل لأسفل"
                      >
                        <Icon name="material-symbols:keyboard-arrow-down" class="h-4 w-4" />
                      </button>
                      <button
                        @click="duplicateComponent(index)"
                        class="p-1 text-blue-400 hover:text-blue-600"
                        title="نسخ"
                      >
                        <Icon name="material-symbols:content-copy" class="h-4 w-4" />
                      </button>
                      <button
                        @click="deleteComponent(index)"
                        class="p-1 text-red-400 hover:text-red-600"
                        title="حذف"
                      >
                        <Icon name="material-symbols:delete" class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div class="text-center py-4 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">{{ comp.type }} - مكون محمل من قاعدة البيانات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
const pageComponents = ref([])
const previewMode = ref(false)
const saving = ref(false)
const componentSearch = ref('')

// تعريف المكونات المتاحة
const componentCategories = ref([
  {
    name: 'العناصر الأساسية',
    components: [
      {
        type: 'hero',
        name: 'قسم البطل',
        icon: 'material-symbols:image',
        props: {
          title: 'مرحباً بك في Wonder Land',
          subtitle: 'اكتشف أجمل الوجهات السياحية',
          backgroundImage: '/images/hero-bg.jpg',
          buttonText: 'اكتشف الآن',
          buttonLink: '/packages'
        }
      },
      {
        type: 'about',
        name: 'من نحن',
        icon: 'material-symbols:info',
        props: {
          title: 'من نحن',
          content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية...',
          image: '/images/about.jpg'
        }
      },
      {
        type: 'services',
        name: 'الخدمات',
        icon: 'material-symbols:room-service',
        props: {
          title: 'خدماتنا',
          services: 'حج وعمرة\nرحلات سياحية\nتذاكر طيران\nحجز فنادق'
        }
      },
      {
        type: 'contact',
        name: 'التواصل',
        icon: 'material-symbols:contact-mail',
        props: {
          title: 'تواصل معنا',
          phone: '+966 50 123 4567',
          email: 'info@wonderland.com',
          address: 'الرياض، المملكة العربية السعودية'
        }
      }
    ]
  }
])

// المكونات المفلترة
const filteredCategories = computed(() => {
  if (!componentSearch.value) return componentCategories.value
  
  return componentCategories.value.map(category => ({
    ...category,
    components: category.components.filter(comp => 
      comp.name.includes(componentSearch.value) || 
      comp.type.includes(componentSearch.value)
    )
  })).filter(category => category.components.length > 0)
})

// إضافة مكون
const addComponent = (componentTemplate) => {
  const newComponent = {
    id: Date.now(),
    type: componentTemplate.type,
    props: { ...componentTemplate.props },
    classes: 'mb-6'
  }
  pageComponents.value.push(newComponent)
}

// إضافة مكونات افتراضية
const addDefaultComponents = () => {
  const route = useRoute()
  const pageId = route.query.page
  
  // مكونات مختلفة حسب نوع الصفحة
  let defaultComponents = []
  
  if (pageId === '1') {
    // الصفحة الرئيسية
    defaultComponents = [
      {
        type: 'hero',
        props: {
          title: 'مرحباً بك في Wonder Land',
          subtitle: 'اكتشف أجمل الوجهات السياحية',
          backgroundImage: '/images/hero-bg.jpg',
          buttonText: 'اكتشف الآن',
          buttonLink: '/packages'
        }
      },
      {
        type: 'about',
        props: {
          title: 'من نحن',
          content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل خدمات السفر والسياحة لعملائنا الكرام.',
          image: '/images/about.jpg'
        }
      }
    ]
  } else if (pageId === '2') {
    // الباقات السياحية
    defaultComponents = [
      {
        type: 'heading',
        props: {
          title: 'الباقات السياحية',
          subtitle: 'اكتشف أفضل العروض والرحلات'
        }
      },
      {
        type: 'services',
        props: {
          title: 'باقاتنا المميزة',
          services: [
            { title: 'باقة دبي', description: 'رحلة لمدة 3 أيام', price: '1500 ريال' },
            { title: 'باقة تركيا', description: 'رحلة لمدة 5 أيام', price: '2500 ريال' },
            { title: 'باقة ماليزيا', description: 'رحلة لمدة 7 أيام', price: '3500 ريال' }
          ]
        }
      }
    ]
  } else if (pageId === '3') {
    // باقة مخصصة
    defaultComponents = [
      {
        type: 'heading',
        props: {
          title: 'باقة مخصصة',
          subtitle: 'صمم رحلتك حسب احتياجاتك'
        }
      },
      {
        type: 'contact',
        props: {
          title: 'تواصل معنا',
          description: 'أخبرنا عن رحلتك المثالية وسنساعدك في تصميمها'
        }
      }
    ]
  } else if (pageId === '4') {
    // من نحن
    defaultComponents = [
      {
        type: 'heading',
        props: {
          title: 'من نحن',
          subtitle: 'تعرف على وكالة السفر وخدماتنا'
        }
      },
      {
        type: 'about',
        props: {
          title: 'قصتنا',
          content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل خدمات السفر والسياحة لعملائنا الكرام. نسعى دائماً لتوفير تجارب سفر لا تُنسى.',
          image: '/images/about.jpg'
        }
      },
      {
        type: 'testimonials',
        props: {
          title: 'آراء عملائنا',
          testimonials: [
            { name: 'أحمد محمد', text: 'تجربة رائعة، شكراً لكم' },
            { name: 'فاطمة علي', text: 'خدمة ممتازة ورحلة لا تُنسى' }
          ]
        }
      }
    ]
  } else {
    // مكونات افتراضية عامة
    defaultComponents = [
      {
        type: 'heading',
        props: {
          title: 'مرحباً بك',
          subtitle: 'ابدأ في إنشاء صفحتك'
        }
      },
      {
        type: 'paragraph',
        props: {
          content: 'هذه صفحة جديدة. يمكنك إضافة المكونات التي تريدها من الشريط الجانبي.'
        }
      }
    ]
  }
  
  defaultComponents.forEach(componentTemplate => {
    addComponent(componentTemplate)
  })
}

// نقل مكون
const moveComponent = (index, direction) => {
  if (direction === 'up' && index > 0) {
    const temp = pageComponents.value[index]
    pageComponents.value[index] = pageComponents.value[index - 1]
    pageComponents.value[index - 1] = temp
  } else if (direction === 'down' && index < pageComponents.value.length - 1) {
    const temp = pageComponents.value[index]
    pageComponents.value[index] = pageComponents.value[index + 1]
    pageComponents.value[index + 1] = temp
  }
}

// حذف مكون
const deleteComponent = (index) => {
  pageComponents.value.splice(index, 1)
}

// تبديل المعاينة
const togglePreview = () => {
  previewMode.value = !previewMode.value
}

// حفظ الصفحة
const savePage = async () => {
  try {
    saving.value = true
    const route = useRoute()
    const pageId = route.query.page
    
    const pageData = {
      title_ar: 'صفحة جديدة',
      title_en: 'New Page',
      content_ar: '',
      content_en: '',
      components: pageComponents.value,
      status: 'draft',
      template: 'default'
    }
    
    if (pageId) {
      // تحديث صفحة موجودة
      const response = await $fetch(`/api/cms/editor/${pageId}`, {
        method: 'PUT',
        body: pageData
      })
      
      if (response.success) {
        console.log('Page saved successfully')
        await navigateTo(`/admin/content/editor?page=${pageId}`)
      }
    } else {
      // إنشاء صفحة جديدة
      const response = await $fetch('/api/cms/editor', {
        method: 'POST',
        body: pageData
      })
      
      if (response.success) {
        console.log('Page created successfully')
        await navigateTo(`/admin/content/editor?page=${response.id}`)
      }
    }
  } catch (error) {
    console.error('Error saving page:', error)
  } finally {
    saving.value = false
  }
}

// نشر الصفحة
const publishPage = async () => {
  try {
    saving.value = true
    const route = useRoute()
    const pageId = route.query.page
    
    const pageData = {
      title_ar: 'صفحة جديدة',
      title_en: 'New Page',
      content_ar: '',
      content_en: '',
      components: pageComponents.value,
      status: 'published',
      template: 'default'
    }
    
    if (pageId) {
      // تحديث صفحة موجودة ونشرها
      const response = await $fetch(`/api/cms/editor/${pageId}`, {
        method: 'PUT',
        body: pageData
      })
      
      if (response.success) {
        console.log('Page published successfully')
        await navigateTo(`/admin/content/editor?page=${pageId}`)
      }
    } else {
      // إنشاء صفحة جديدة ونشرها
      const response = await $fetch('/api/cms/editor', {
        method: 'POST',
        body: pageData
      })
      
      if (response.success) {
        console.log('Page created and published successfully')
        await navigateTo(`/admin/content/editor?page=${response.id}`)
      }
    }
  } catch (error) {
    console.error('Error publishing page:', error)
  } finally {
    saving.value = false
  }
}

// تحميل الصفحة الحالية
const loadCurrentPage = async () => {
  const route = useRoute()
  const pageId = route.query.page
  
  if (pageId) {
    try {
      console.log('Loading page with ID:', pageId)
      const response = await $fetch(`/api/cms/editor/${pageId}`)
      console.log('API Response:', response)
      
      if (response.success && response.page) {
        // تحميل المكونات الموجودة
        if (response.page.components && Array.isArray(response.page.components) && response.page.components.length > 0) {
          console.log('Loading existing components:', response.page.components)
          pageComponents.value = response.page.components
        } else {
          console.log('No components found, adding default components')
          // إذا لم تكن هناك مكونات، أضف مكونات افتراضية
          addDefaultComponents()
        }
      } else {
        console.log('No page data found, adding default components')
        addDefaultComponents()
      }
    } catch (error) {
      console.error('Error loading page:', error)
      addDefaultComponents()
    }
  } else {
    // صفحة جديدة - تحقق من وجود قالب
    const templateId = route.query.template
    if (templateId) {
      console.log('Loading template:', templateId)
      addDefaultComponents()
    }
  }
}

// نسخ المكون
const duplicateComponent = (index) => {
  if (index >= 0 && index < pageComponents.value.length) {
    const originalComponent = pageComponents.value[index]
    const duplicatedComponent = {
      ...originalComponent,
      id: Date.now() + Math.random() // إنشاء معرف فريد
    }
    pageComponents.value.splice(index + 1, 0, duplicatedComponent)
  }
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadCurrentPage()
})

// SEO والميتا
useHead({
  title: 'محرر المحتوى - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'محرر محتوى متقدم لإنشاء وتعديل الصفحات' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>