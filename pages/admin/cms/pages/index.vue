<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة الصفحات</h1>
        <p class="text-gray-600">إدارة صفحات الموقع والمحتوى</p>
      </div>
      <NuxtLink
        to="/admin/cms/pages/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
        صفحة جديدة
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <label class="block text-sm font-medium text-gray-700 mb-2">البحث</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في الصفحات..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
        <div class="min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">القالب</label>
          <select
            v-model="templateFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع القوالب</option>
            <option value="home">الرئيسية</option>
            <option value="about">من نحن</option>
            <option value="services">الخدمات</option>
            <option value="contact">اتصل بنا</option>
            <option value="default">افتراضي</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Pages Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">الصفحات</h2>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <Icon name="material-symbols:refresh" class="h-8 w-8 text-gray-400 animate-spin mx-auto" />
        <p class="text-gray-600 mt-2">جاري التحميل...</p>
      </div>

      <div v-else-if="filteredPages.length === 0" class="text-center py-8">
        <Icon name="material-symbols:description" class="h-12 w-12 text-gray-400 mx-auto" />
        <p class="text-gray-600 mt-2">لا توجد صفحات</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصفحة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القالب</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر تحديث</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="page in paginatedPages" :key="page.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ page.title }}</div>
                  <div class="text-sm text-gray-500">{{ page.slug }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    page.status === 'published' ? 'bg-green-100 text-green-800' :
                    page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ getStatusText(page.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getTemplateText(page.template) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(page.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <NuxtLink
                    :to="`/admin/cms/pages/${page.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    تعديل
                  </NuxtLink>
                  <button
                    @click="toggleStatus(page)"
                    :class="[
                      'px-2 py-1 text-xs rounded',
                      page.status === 'published' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                      'bg-green-100 text-green-800 hover:bg-green-200'
                    ]"
                  >
                    {{ page.status === 'published' ? 'إلغاء النشر' : 'نشر' }}
                  </button>
                  <button
                    @click="deletePage(page)"
                    class="text-red-600 hover:text-red-900"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, filteredPages.length) }} من {{ filteredPages.length }} صفحة
          </div>
          <div class="flex space-x-2 space-x-reverse">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <span
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 text-sm border rounded cursor-pointer',
                page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </span>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
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
const pages = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const templateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredPages = computed(() => {
  let filtered = pages.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(page => 
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(page => page.status === statusFilter.value)
  }

  if (templateFilter.value) {
    filtered = filtered.filter(page => page.template === templateFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPages.value.length / itemsPerPage))

const paginatedPages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPages.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
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

const getTemplateText = (template) => {
  const templateMap = {
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'الخدمات',
    contact: 'اتصل بنا',
    default: 'افتراضي'
  }
  return templateMap[template] || template
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const loadPages = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/cms/pages?limit=1000')
    pages.value = response.data.pages
  } catch (error) {
    console.error('Error loading pages:', error)
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (page) => {
  try {
    const newStatus = page.status === 'published' ? 'draft' : 'published'
    
    await $fetch(`/api/cms/pages/${page.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    page.status = newStatus
  } catch (error) {
    console.error('Error updating page status:', error)
  }
}

const deletePage = async (page) => {
  if (!confirm(`هل أنت متأكد من حذف الصفحة "${page.title}"؟`)) {
    return
  }

  try {
    await $fetch(`/api/cms/pages/${page.id}`, {
      method: 'DELETE'
    })
    
    pages.value = pages.value.filter(p => p.id !== page.id)
  } catch (error) {
    console.error('Error deleting page:', error)
  }
}

// Watch filters to reset pagination
watch([searchQuery, statusFilter, templateFilter], () => {
  currentPage.value = 1
})

// Load data on mount
onMounted(() => {
  loadPages()
})
</script>
