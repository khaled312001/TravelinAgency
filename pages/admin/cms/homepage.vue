<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة الصفحة الرئيسية</h1>
        <p class="text-gray-600">تعديل محتوى وعرض الصفحة الرئيسية</p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <button
          @click="previewHomepage"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Icon name="material-symbols:visibility" class="h-5 w-5 ml-2" />
          معاينة
        </button>
        <button
          @click="saveAllChanges"
          :disabled="saving"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          <Icon v-if="saving" name="material-symbols:refresh" class="h-5 w-5 ml-2 animate-spin" />
          <Icon v-else name="material-symbols:save" class="h-5 w-5 ml-2" />
          {{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Icon name="material-symbols:refresh" class="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">جاري تحميل محتوى الصفحة الرئيسية...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="material-symbols:error" class="h-12 w-12 text-red-600 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">حدث خطأ في تحميل المحتوى</p>
      <button 
        @click="loadHomepageContent"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>

    <!-- Content Management -->
    <div v-else class="space-y-6">
      <!-- Homepage Info -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">معلومات الصفحة الرئيسية</h2>
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              homepagePage?.status === 'published' ? 'bg-green-100 text-green-800' :
              homepagePage?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            ]"
          >
            {{ getStatusText(homepagePage?.status) }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الصفحة</label>
            <input
              v-model="homepagePage.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="عنوان الصفحة الرئيسية"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حالة النشر</label>
            <select
              v-model="homepagePage.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sections Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">أقسام الصفحة الرئيسية</h2>
            <button
              @click="showAddSectionModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
              إضافة قسم
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="sections.length === 0" class="text-center py-8">
            <Icon name="material-symbols:add-box" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-4">لا توجد أقسام بعد</p>
            <button
              @click="showAddSectionModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة أول قسم
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(section, index) in sections"
              :key="section.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg ml-3">
                    <Icon :name="getSectionIcon(section.section_type)" class="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ section.title || getSectionTypeName(section.section_type) }}</h3>
                    <p class="text-sm text-gray-600">{{ getSectionTypeName(section.section_type) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button
                    @click="toggleSectionActive(section)"
                    :class="[
                      'px-3 py-1 text-xs font-medium rounded-full',
                      section.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ section.is_active ? 'نشط' : 'غير نشط' }}
                  </button>
                  <button
                    @click="editSection(section)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    @click="deleteSection(section)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <!-- Section Preview -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">معاينة القسم:</div>
                <div class="text-sm">
                  <div v-if="section.title" class="font-medium text-gray-900 mb-1">{{ section.title }}</div>
                  <div v-if="section.subtitle" class="text-gray-600 mb-2">{{ section.subtitle }}</div>
                  <div v-if="section.content" class="text-gray-500 text-xs" v-html="truncateHtml(section.content, 100)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Section Modal -->
    <div v-if="showAddSectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">إضافة قسم جديد</h3>
          <button @click="showAddSectionModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نوع القسم</label>
            <select
              v-model="newSection.section_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hero">قسم البطل (Hero)</option>
              <option value="about">من نحن</option>
              <option value="services">الخدمات</option>
              <option value="testimonials">الشهادات</option>
              <option value="contact">التواصل</option>
              <option value="generic">قسم عام</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
            <input
              v-model="newSection.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="عنوان القسم"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 space-x-reverse mt-6">
          <button
            @click="showAddSectionModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="addSection"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Section Modal -->
    <div v-if="showEditSectionModal && editingSection" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">تعديل القسم</h3>
          <button @click="showEditSectionModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</label>
              <input
                v-model="editingSection.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">العنوان الفرعي</label>
              <input
                v-model="editingSection.subtitle"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">محتوى القسم</label>
            <textarea
              v-model="editingSection.content"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="محتوى القسم..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لون الخلفية</label>
              <input
                v-model="editingSection.background_color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لون النص</label>
              <input
                v-model="editingSection.text_color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ترتيب القسم</label>
              <input
                v-model.number="editingSection.order_index"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 space-x-reverse mt-6">
          <button
            @click="showEditSectionModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="saveSection"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// State
const loading = ref(true)
const error = ref(false)
const saving = ref(false)
const homepagePage = ref(null)
const sections = ref([])
const showAddSectionModal = ref(false)
const showEditSectionModal = ref(false)
const editingSection = ref(null)

const newSection = ref({
  section_type: 'hero',
  title: '',
  subtitle: '',
  content: '',
  background_color: '#1e40af',
  text_color: '#ffffff',
  order_index: 0
})

// Methods
const getStatusText = (status) => {
  const statusMap = {
    published: 'منشور',
    draft: 'مسودة',
    archived: 'مؤرشف'
  }
  return statusMap[status] || status
}

const getSectionIcon = (type) => {
  const icons = {
    hero: 'material-symbols:home',
    about: 'material-symbols:info',
    services: 'material-symbols:work',
    testimonials: 'material-symbols:star',
    contact: 'material-symbols:contact-mail',
    generic: 'material-symbols:article'
  }
  return icons[type] || 'material-symbols:article'
}

const getSectionTypeName = (type) => {
  const names = {
    hero: 'قسم البطل',
    about: 'من نحن',
    services: 'الخدمات',
    testimonials: 'الشهادات',
    contact: 'التواصل',
    generic: 'قسم عام'
  }
  return names[type] || type
}

const truncateHtml = (html, length) => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '')
  return text.length > length ? text.substring(0, length) + '...' : text
}

const loadHomepageContent = async () => {
  try {
    loading.value = true
    error.value = false
    
    // Load homepage page
    const pageResponse = await $fetch('/api/cms/pages/home')
    if (pageResponse.success) {
      homepagePage.value = pageResponse.data.page
      sections.value = pageResponse.data.sections || []
    } else {
      // Create homepage page if it doesn't exist
      await createHomepagePage()
    }
  } catch (err) {
    console.error('Error loading homepage content:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const createHomepagePage = async () => {
  try {
    const response = await $fetch('/api/cms/pages', {
      method: 'POST',
      body: {
        slug: 'home',
        title: 'الصفحة الرئيسية',
        status: 'published'
      }
    })
    
    if (response.success) {
      homepagePage.value = response.data.page
      sections.value = []
    }
  } catch (err) {
    console.error('Error creating homepage page:', err)
  }
}

const addSection = async () => {
  try {
    const response = await $fetch('/api/cms/sections', {
      method: 'POST',
      body: {
        page_id: homepagePage.value.id,
        ...newSection.value
      }
    })
    
    if (response.success) {
      sections.value.push(response.data.section)
      showAddSectionModal.value = false
      resetNewSection()
    }
  } catch (err) {
    console.error('Error adding section:', err)
  }
}

const editSection = (section) => {
  editingSection.value = { ...section }
  showEditSectionModal.value = true
}

const saveSection = async () => {
  try {
    const response = await $fetch(`/api/cms/sections/${editingSection.value.id}`, {
      method: 'PUT',
      body: editingSection.value
    })
    
    if (response.success) {
      const index = sections.value.findIndex(s => s.id === editingSection.value.id)
      if (index !== -1) {
        sections.value[index] = response.data.section
      }
      showEditSectionModal.value = false
      editingSection.value = null
    }
  } catch (err) {
    console.error('Error saving section:', err)
  }
}

const deleteSection = async (section) => {
  if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return
  
  try {
    await $fetch(`/api/cms/sections/${section.id}`, {
      method: 'DELETE'
    })
    
    sections.value = sections.value.filter(s => s.id !== section.id)
  } catch (err) {
    console.error('Error deleting section:', err)
  }
}

const toggleSectionActive = async (section) => {
  try {
    const response = await $fetch(`/api/cms/sections/${section.id}`, {
      method: 'PUT',
      body: {
        is_active: !section.is_active
      }
    })
    
    if (response.success) {
      const index = sections.value.findIndex(s => s.id === section.id)
      if (index !== -1) {
        sections.value[index].is_active = !sections.value[index].is_active
      }
    }
  } catch (err) {
    console.error('Error toggling section:', err)
  }
}

const saveAllChanges = async () => {
  try {
    saving.value = true
    
    // Save page info
    if (homepagePage.value) {
      await $fetch(`/api/cms/pages/${homepagePage.value.id}`, {
        method: 'PUT',
        body: {
          title: homepagePage.value.title,
          status: homepagePage.value.status
        }
      })
    }
    
    // Show success message
    alert('تم حفظ جميع التغييرات بنجاح!')
  } catch (err) {
    console.error('Error saving changes:', err)
    alert('حدث خطأ في حفظ التغييرات')
  } finally {
    saving.value = false
  }
}

const previewHomepage = () => {
  window.open('/', '_blank')
}

const resetNewSection = () => {
  newSection.value = {
    section_type: 'hero',
    title: '',
    subtitle: '',
    content: '',
    background_color: '#1e40af',
    text_color: '#ffffff',
    order_index: 0
  }
}

// Load data on mount
onMounted(() => {
  loadHomepageContent()
})
</script>
