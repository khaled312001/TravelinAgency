<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- شريط الأدوات العلوي -->
    <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4 space-x-reverse">
        <NuxtLink
          to="/admin/content"
          class="flex items-center text-gray-600 hover:text-gray-900"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
        <div class="h-6 w-px bg-gray-300"></div>
        <h1 class="text-lg font-semibold text-gray-900">محرر المحتوى</h1>
      </div>
      
      <div class="flex items-center space-x-3 space-x-reverse">
        <!-- معاينة -->
        <button
          @click="togglePreview"
          :class="previewMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
          class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Icon name="material-symbols:visibility" class="h-4 w-4 ml-1" />
          معاينة
        </button>
        
        <!-- حفظ -->
        <button
          @click="savePage"
          :disabled="saving"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
        >
          <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2" />
          <Icon v-else name="material-symbols:save" class="h-4 w-4 ml-2" />
          {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
        </button>
        
        <!-- نشر -->
        <button
          @click="publishPage"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
        >
          <Icon name="material-symbols:publish" class="h-4 w-4 ml-2" />
          نشر
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- الشريط الجانبي للمكونات -->
      <div v-if="!previewMode" class="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">المكونات</h2>
          
          <!-- البحث في المكونات -->
          <div class="relative mb-4">
            <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="componentSearch"
              type="text"
              placeholder="البحث في المكونات..."
              class="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- فئات المكونات -->
          <div class="space-y-4">
            <div v-for="category in filteredComponentCategories" :key="category.name" class="space-y-2">
              <h3 class="text-sm font-medium text-gray-700 flex items-center">
                <Icon :name="category.icon" class="h-4 w-4 ml-2" />
                {{ category.name }}
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="component in category.components"
                  :key="component.type"
                  @click="addComponent(component)"
                  class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div class="flex flex-col items-center text-center">
                    <Icon :name="component.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600 mb-2" />
                    <span class="text-xs font-medium text-gray-700 group-hover:text-blue-700">{{ component.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- منطقة التحرير الرئيسية -->
      <div class="flex-1 flex flex-col">
        <!-- شريط أدوات التحرير -->
        <div v-if="!previewMode && selectedComponent" class="bg-white border-b border-gray-200 px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <Icon :name="selectedComponent.icon" class="h-5 w-5 text-gray-600" />
              <span class="font-medium text-gray-900">{{ selectedComponent.name }}</span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <button
                @click="duplicateComponent(selectedComponent)"
                class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="نسخ"
              >
                <Icon name="material-symbols:content-copy" class="h-4 w-4" />
              </button>
              <button
                @click="deleteComponent(selectedComponent)"
                class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف"
              >
                <Icon name="material-symbols:delete" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- منطقة المحتوى -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-4xl mx-auto p-6">
            <!-- معاينة الصفحة -->
            <div v-if="previewMode" class="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">معاينة الصفحة</h2>
                <div class="prose max-w-none">
                  <div v-for="(component, index) in pageComponents" :key="index" class="mb-6">
                    <component
                      :is="getComponentName(component.type)"
                      v-bind="component.props"
                      :class="component.classes"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- منطقة التحرير -->
            <div v-else class="space-y-4">
              <!-- رسالة فارغة -->
              <div v-if="pageComponents.length === 0" class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
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

              <!-- المكونات -->
              <div
                v-for="(component, index) in pageComponents"
                :key="component.id"
                @click="selectComponent(component, index)"
                :class="[
                  'relative group cursor-pointer transition-all duration-200',
                  selectedComponentIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
                ]"
              >
                <!-- شريط التحكم -->
                <div class="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex space-x-1 space-x-reverse">
                    <button
                      @click.stop="moveComponent(index, 'up')"
                      :disabled="index === 0"
                      class="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
                      title="نقل لأعلى"
                    >
                      <Icon name="material-symbols:keyboard-arrow-up" class="h-4 w-4" />
                    </button>
                    <button
                      @click.stop="moveComponent(index, 'down')"
                      :disabled="index === pageComponents.length - 1"
                      class="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
                      title="نقل لأسفل"
                    >
                      <Icon name="material-symbols:keyboard-arrow-down" class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <!-- المكون -->
                <component
                  :is="getComponentName(component.type)"
                  v-bind="component.props"
                  :class="component.classes"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- الشريط الجانبي للخصائص -->
      <div v-if="!previewMode && selectedComponent" class="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">خصائص المكون</h2>
          
          <!-- خصائص المكون المحدد -->
          <div class="space-y-4">
            <div v-for="prop in selectedComponent.properties" :key="prop.key" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">{{ prop.label }}</label>
              
              <!-- نص -->
              <input
                v-if="prop.type === 'text'"
                v-model="selectedComponent.props[prop.key]"
                type="text"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="prop.placeholder"
              />
              
              <!-- نص طويل -->
              <textarea
                v-else-if="prop.type === 'textarea'"
                v-model="selectedComponent.props[prop.key]"
                :rows="prop.rows || 3"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="prop.placeholder"
              ></textarea>
              
              <!-- اختيار -->
              <select
                v-else-if="prop.type === 'select'"
                v-model="selectedComponent.props[prop.key]"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="option in prop.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              
              <!-- لون -->
              <input
                v-else-if="prop.type === 'color'"
                v-model="selectedComponent.props[prop.key]"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <!-- رقم -->
              <input
                v-else-if="prop.type === 'number'"
                v-model.number="selectedComponent.props[prop.key]"
                type="number"
                :min="prop.min"
                :max="prop.max"
                :step="prop.step"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <!-- صورة -->
              <div v-else-if="prop.type === 'image'" class="space-y-2">
                <input
                  v-model="selectedComponent.props[prop.key]"
                  type="text"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="رابط الصورة"
                />
                <button
                  @click="openMediaLibrary"
                  class="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  اختيار من المكتبة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- مكتبة الوسائط -->
    <MediaLibrary
      v-if="showMediaLibrary"
      @close="showMediaLibrary = false"
      @select="selectMedia"
    />
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
const selectedComponent = ref(null)
const selectedComponentIndex = ref(-1)
const previewMode = ref(false)
const saving = ref(false)
const componentSearch = ref('')
const showMediaLibrary = ref(false)

// تعريف المكونات المتاحة
const componentCategories = ref([
  {
    name: 'العناصر الأساسية',
    icon: 'material-symbols:widgets',
    components: [
      {
        type: 'hero',
        name: 'قسم البطل',
        icon: 'material-symbols:image',
        properties: [
          { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' },
          { key: 'subtitle', label: 'العنوان الفرعي', type: 'text', placeholder: 'أدخل العنوان الفرعي' },
          { key: 'backgroundImage', label: 'صورة الخلفية', type: 'image', placeholder: 'رابط الصورة' },
          { key: 'buttonText', label: 'نص الزر', type: 'text', placeholder: 'نص الزر' },
          { key: 'buttonLink', label: 'رابط الزر', type: 'text', placeholder: 'رابط الزر' }
        ],
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
        properties: [
          { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' },
          { key: 'content', label: 'المحتوى', type: 'textarea', rows: 4, placeholder: 'أدخل المحتوى' },
          { key: 'image', label: 'الصورة', type: 'image', placeholder: 'رابط الصورة' }
        ],
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
        properties: [
          { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' },
          { key: 'services', label: 'الخدمات', type: 'textarea', rows: 6, placeholder: 'أدخل قائمة الخدمات' }
        ],
        props: {
          title: 'خدماتنا',
          services: 'حج وعمرة\nرحلات سياحية\nتذاكر طيران\nحجز فنادق'
        }
      },
      {
        type: 'testimonials',
        name: 'الشهادات',
        icon: 'material-symbols:star',
        properties: [
          { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' }
        ],
        props: {
          title: 'آراء عملائنا'
        }
      },
      {
        type: 'contact',
        name: 'التواصل',
        icon: 'material-symbols:contact-mail',
        properties: [
          { key: 'title', label: 'العنوان', type: 'text', placeholder: 'أدخل العنوان' },
          { key: 'phone', label: 'الهاتف', type: 'text', placeholder: 'رقم الهاتف' },
          { key: 'email', label: 'البريد الإلكتروني', type: 'text', placeholder: 'البريد الإلكتروني' },
          { key: 'address', label: 'العنوان', type: 'text', placeholder: 'العنوان' }
        ],
        props: {
          title: 'تواصل معنا',
          phone: '+966 50 123 4567',
          email: 'info@wonderland.com',
          address: 'الرياض، المملكة العربية السعودية'
        }
      }
    ]
  },
  {
    name: 'النصوص والعناوين',
    icon: 'material-symbols:text-fields',
    components: [
      {
        type: 'heading',
        name: 'عنوان',
        icon: 'material-symbols:title',
        properties: [
          { key: 'text', label: 'النص', type: 'text', placeholder: 'أدخل النص' },
          { key: 'level', label: 'المستوى', type: 'select', options: [
            { value: 'h1', label: 'H1' },
            { value: 'h2', label: 'H2' },
            { value: 'h3', label: 'H3' },
            { value: 'h4', label: 'H4' }
          ]},
          { key: 'color', label: 'اللون', type: 'color' }
        ],
        props: {
          text: 'عنوان جديد',
          level: 'h2',
          color: '#1f2937'
        }
      },
      {
        type: 'paragraph',
        name: 'فقرة',
        icon: 'material-symbols:format-align-right',
        properties: [
          { key: 'text', label: 'النص', type: 'textarea', rows: 4, placeholder: 'أدخل النص' },
          { key: 'color', label: 'اللون', type: 'color' }
        ],
        props: {
          text: 'هذا نص فقرة جديد...',
          color: '#374151'
        }
      }
    ]
  },
  {
    name: 'الصور والوسائط',
    icon: 'material-symbols:image',
    components: [
      {
        type: 'image',
        name: 'صورة',
        icon: 'material-symbols:image',
        properties: [
          { key: 'src', label: 'رابط الصورة', type: 'image', placeholder: 'رابط الصورة' },
          { key: 'alt', label: 'النص البديل', type: 'text', placeholder: 'النص البديل' },
          { key: 'width', label: 'العرض', type: 'number', min: 100, max: 1200, step: 50 },
          { key: 'height', label: 'الارتفاع', type: 'number', min: 100, max: 800, step: 50 }
        ],
        props: {
          src: '/images/placeholder.jpg',
          alt: 'صورة',
          width: 400,
          height: 300
        }
      }
    ]
  }
])

// المكونات المحسوبة
const filteredComponentCategories = computed(() => {
  if (!componentSearch.value) return componentCategories.value
  
  return componentCategories.value.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(componentSearch.value.toLowerCase())
    )
  })).filter(category => category.components.length > 0)
})

// دوال التحرير
const addComponent = (componentTemplate) => {
  const newComponent = {
    id: Date.now(),
    type: componentTemplate.type,
    props: { ...componentTemplate.props },
    classes: 'mb-6'
  }
  
  pageComponents.value.push(newComponent)
  selectComponent(newComponent, pageComponents.value.length - 1)
}

const selectComponent = (component, index) => {
  selectedComponent.value = component
  selectedComponentIndex.value = index
}

const deleteComponent = (component) => {
  const index = pageComponents.value.findIndex(c => c.id === component.id)
  if (index !== -1) {
    pageComponents.value.splice(index, 1)
    selectedComponent.value = null
    selectedComponentIndex.value = -1
  }
}

const duplicateComponent = (component) => {
  const duplicatedComponent = {
    id: Date.now(),
    type: component.type,
    props: { ...component.props },
    classes: component.classes
  }
  
  const index = pageComponents.value.findIndex(c => c.id === component.id)
  pageComponents.value.splice(index + 1, 0, duplicatedComponent)
  selectComponent(duplicatedComponent, index + 1)
}

const moveComponent = (index, direction) => {
  if (direction === 'up' && index > 0) {
    const component = pageComponents.value.splice(index, 1)[0]
    pageComponents.value.splice(index - 1, 0, component)
    selectedComponentIndex.value = index - 1
  } else if (direction === 'down' && index < pageComponents.value.length - 1) {
    const component = pageComponents.value.splice(index, 1)[0]
    pageComponents.value.splice(index + 1, 0, component)
    selectedComponentIndex.value = index + 1
  }
}

const addDefaultComponents = () => {
  const defaultComponents = [
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
        content: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل الخدمات السياحية والحج والعمرة.',
        image: '/images/about.jpg'
      }
    },
    {
      type: 'services',
      props: {
        title: 'خدماتنا',
        services: 'حج وعمرة\nرحلات سياحية\nتذاكر طيران\nحجز فنادق'
      }
    }
  ]
  
  defaultComponents.forEach(componentTemplate => {
    addComponent(componentTemplate)
  })
}

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

const togglePreview = () => {
  previewMode.value = !previewMode.value
  if (previewMode.value) {
    selectedComponent.value = null
    selectedComponentIndex.value = -1
  }
}

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
        // إعادة توجيه إلى صفحة التحرير مع معرف الصفحة
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
        // إعادة توجيه إلى صفحة التحرير مع معرف الصفحة الجديدة
        await navigateTo(`/admin/content/editor?page=${response.id}`)
      }
    }
  } catch (error) {
    console.error('Error saving page:', error)
  } finally {
    saving.value = false
  }
}

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

const openMediaLibrary = () => {
  showMediaLibrary.value = true
}

const selectMedia = (media) => {
  if (selectedComponent.value && selectedComponent.value.props) {
    // Find the first image property and set it
    const imageProp = selectedComponent.value.properties?.find(p => p.type === 'image')
    if (imageProp) {
      selectedComponent.value.props[imageProp.key] = media.url
    }
  }
  showMediaLibrary.value = false
}

// تحميل الصفحة الحالية
const loadCurrentPage = async () => {
  const route = useRoute()
  const pageId = route.query.page
  
  if (pageId) {
    try {
      const response = await $fetch(`/api/cms/editor/${pageId}`)
      if (response.success && response.page) {
        // تحميل المكونات الموجودة
        if (response.page.components && Array.isArray(response.page.components)) {
          pageComponents.value = response.page.components
        } else {
          // إذا لم تكن هناك مكونات، أضف مكونات افتراضية
          addDefaultComponents()
        }
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
