<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- إشعار التحديث -->
    <div v-if="notification" class="fixed top-20 right-4 z-50">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-3 space-x-reverse',
        notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 
        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
        'bg-red-50 border-red-400 text-red-800'
      ]">
        <Icon 
          :name="notification.type === 'success' ? 'material-symbols:check-circle' : 
                 notification.type === 'warning' ? 'material-symbols:warning' : 
                 'material-symbols:error'" 
          class="h-5 w-5" 
        />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </div>
    
    <!-- رأس الصفحة -->
    <AdminPageHeader 
      title="إدارة المحتوى"
      description="إدارة صفحات الموقع والمحتوى"
    >
      <template #actions>
        <NuxtLink
          to="/admin/content/analytics"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:analytics" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">الإحصائيات</span>
          <span class="sm:hidden">إحصائيات</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/content/templates"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:widgets" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">القوالب</span>
          <span class="sm:hidden">قوالب</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/content/editor"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">محرر المحتوى</span>
          <span class="sm:hidden">محرر</span>
        </NuxtLink>
        <button
          @click="forceRefreshNavigation"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          :disabled="refreshingNavigation"
        >
          <Icon v-if="refreshingNavigation" name="material-symbols:progress-activity" class="h-4 w-4 sm:h-5 sm:w-5 ml-2 animate-spin" />
          <Icon v-else name="material-symbols:refresh" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">تحديث التنقل</span>
          <span class="sm:hidden">تحديث</span>
        </button>
        <button
          @click="forceRefreshPage"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:refresh" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">تحديث الصفحة</span>
          <span class="sm:hidden">تحديث</span>
        </button>
        <NuxtLink
          to="/admin/content/create"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:add" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">إضافة صفحة جديدة</span>
          <span class="sm:hidden">إضافة</span>
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <!-- إحصائيات سريعة -->
    <AdminStats :stats="contentStats" />






    <!-- شريط البحث والتصفية -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- البحث -->
        <div class="relative">
          <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في الصفحات..."
            class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- تصفية حسب الحالة -->
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>

        <!-- تصفية حسب النوع -->
        <select
          v-model="typeFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الأنواع</option>
          <option value="page">صفحة</option>
          <option value="post">مقال</option>
          <option value="news">أخبار</option>
        </select>
      </div>
    </div>

    <!-- قائمة الصفحات -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الصفحات...</span>
      </div>

      <!-- قائمة الصفحات -->
      <div v-else-if="filteredPages.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصفحة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرابط
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الإنشاء
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="page in filteredPages" :key="page.id" class="hover:bg-gray-50">
              <!-- معلومات الصفحة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                      <Icon name="material-symbols:article" class="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">{{ page.title_ar || page.title_en || page.title }}</div>
                    <div class="text-sm text-gray-500">{{ truncateText(page.content_ar || page.content_en || page.content, 50) }}</div>
                  </div>
                </div>
              </td>

              <!-- الرابط -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <a
                    :href="page.url || `/${page.slug || ''}`"
                    target="_blank"
                    class="text-sm text-indigo-600 hover:text-indigo-900 font-mono bg-gray-100 px-2 py-1 rounded"
                  >
                    {{ page.url || `/${page.slug || ''}` }}
                  </a>
                </div>
              </td>

              <!-- النوع -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeColor(page.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getTypeName(page.type) }}
                </span>
              </td>

              <!-- الحالة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(page.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(page.status) }}
                </span>
              </td>

              <!-- تاريخ الإنشاء -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(page.created_at) }}
              </td>

              <!-- الإجراءات -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <!-- عرض الصفحة على الموقع -->
                  <a
                    :href="page.url || `/${page.slug || ''}`"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                    title="عرض الصفحة على الموقع"
                  >
                    <Icon name="material-symbols:open-in-new" class="h-4 w-4" />
                  </a>
                  <NuxtLink
                    :to="`/admin/content/preview/${page.id}`"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="معاينة"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/content/editor?page=${page.id}`"
                    class="text-purple-600 hover:text-purple-900 p-1 rounded"
                    title="تحرير متقدم"
                  >
                    <Icon name="material-symbols:design-services" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/content/${page.id}/edit`"
                    class="text-green-600 hover:text-green-900 p-1 rounded"
                    title="تحرير"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="togglePageStatus(page)"
                    :class="[
                      page.status === 'published' ? 'text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100' : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100',
                      togglingStatus.has(page.id) ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    class="p-2 rounded-lg transition-all duration-200 border border-current border-opacity-20"
                    :title="page.status === 'published' ? 'إلغاء النشر (إخفاء الصفحة)' : 'نشر (إظهار الصفحة)'"
                    :disabled="loading || togglingStatus.has(page.id)"
                  >
                    <Icon 
                      v-if="togglingStatus.has(page.id)"
                      name="material-symbols:progress-activity" 
                      class="h-4 w-4 animate-spin" 
                    />
                    <Icon 
                      v-else
                      :name="page.status === 'published' ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" 
                      class="h-4 w-4" 
                    />
                  </button>
                  <button
                    @click="deletePage(page)"
                    class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100 transition-colors"
                    title="حذف"
                    :disabled="loading"
                  >
                    <Icon name="material-symbols:delete" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-else class="text-center py-12">
        <Icon name="material-symbols:article" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد صفحات</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي صفحات</p>
        <NuxtLink
          to="/admin/content/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة صفحة جديدة
        </NuxtLink>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} صفحة
      </div>
      <div class="flex space-x-1 space-x-reverse">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        <span class="px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-md">
          {{ currentPage }}
        </span>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PieChart, DoughnutChart, BarChart } from '~/components/charts'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const pages = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const notification = ref(null)
const togglingStatus = ref(new Set())
const refreshingNavigation = ref(false)

// دالة إظهار الإشعار
const showNotification = (message, type = 'success') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// دالة إجبار تحديث التنقل
const forceRefreshNavigation = async () => {
  try {
    refreshingNavigation.value = true
    console.log('🔄 Force refreshing navigation...')
    
    const response = await $fetch('/api/public/navigation/refresh', { 
      method: 'POST',
      body: { menu_name: 'main' }
    })
    
    if (response.success) {
      // Also refresh navigation in the frontend
      const { refreshAllNavigation } = useNavigationRefresh()
      await refreshAllNavigation()
      
      showNotification('تم تحديث التنقل بنجاح', 'success')
      console.log('✅ Navigation refreshed successfully')
    }
  } catch (error) {
    console.error('❌ Error refreshing navigation:', error)
    showNotification('خطأ في تحديث التنقل', 'error')
  } finally {
    refreshingNavigation.value = false
  }
}

// المتغيرات المحسوبة
const filteredPages = computed(() => {
  let filtered = pages.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(page => 
      (page.title_ar && page.title_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.title_en && page.title_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.title && page.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content_ar && page.content_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content_en && page.content_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content && page.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(page => page.status === statusFilter.value)
  }

  // تصفية النوع
  if (typeFilter.value) {
    filtered = filtered.filter(page => page.type === typeFilter.value)
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = pages.value

  if (searchQuery.value) {
    filtered = filtered.filter(page => 
      (page.title_ar && page.title_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.title_en && page.title_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.title && page.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content_ar && page.content_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content_en && page.content_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (page.content && page.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(page => page.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(page => page.type === typeFilter.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// إحصائيات
const totalPagesCount = computed(() => pages.value.length)
const publishedPages = computed(() => pages.value.filter(page => page.status === 'published').length)
const draftPages = computed(() => pages.value.filter(page => page.status === 'draft').length)
const todayPages = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return pages.value.filter(page => new Date(page.created_at) >= today).length
})

// إحصائيات المحتوى
const contentStats = computed(() => [
  {
    key: 'total',
    label: 'إجمالي الصفحات',
    value: totalPagesCount.value,
    icon: 'material-symbols:article',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    key: 'published',
    label: 'منشور',
    value: publishedPages.value,
    icon: 'material-symbols:visibility',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    key: 'draft',
    label: 'مسودة',
    value: draftPages.value,
    icon: 'material-symbols:edit',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    key: 'today',
    label: 'اليوم',
    value: todayPages.value,
    icon: 'material-symbols:today',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])

// بيانات الرسوم البيانية للمحتوى
const contentTypeData = computed(() => {
  const typeCounts = pages.value.reduce((acc, page) => {
    acc[page.type] = (acc[page.type] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(typeCounts).map(type => getTypeName(type)),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)'
      ]
    }]
  }
})

const contentStatusData = computed(() => {
  const statusCounts = pages.value.reduce((acc, page) => {
    acc[page.status] = (acc[page.status] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(statusCounts).map(status => getStatusName(status)),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)',
        'rgb(107, 114, 128)'
      ]
    }]
  }
})

const monthlyPublishingData = computed(() => {
  const monthlyCounts = {}
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
  
  // تهيئة العدادات
  months.forEach(month => {
    monthlyCounts[month] = 0
  })

  // حساب عدد الصفحات المنشورة في كل شهر
  pages.value.forEach(page => {
    if (page.status === 'published') {
      const date = new Date(page.created_at)
      const monthIndex = date.getMonth()
      if (monthIndex < 6) { // آخر 6 أشهر
        monthlyCounts[months[monthIndex]]++
      }
    }
  })

  return {
    labels: months,
    datasets: [{
      label: 'عدد الصفحات المنشورة',
      data: Object.values(monthlyCounts),
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderColor: 'rgb(139, 92, 246)',
      borderWidth: 1
    }]
  }
})

// إعدادات الرسوم البيانية
const contentTypeOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    }
  }
})

const contentStatusOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    }
  }
})

const monthlyPublishingOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
})

// تحميل الصفحات
const loadPages = async () => {
  try {
    loading.value = true
    console.log('🔄 Loading pages from API...')
    const result = await $fetch('/api/content')
    console.log('📊 API Response:', result)
    
    // Ensure pages.value is always an array
    if (result && result.pages && Array.isArray(result.pages)) {
      pages.value = result.pages
      console.log('✅ Loaded pages:', pages.value.length)
    } else if (Array.isArray(result)) {
      pages.value = result
      console.log('✅ Loaded pages (direct array):', pages.value.length)
    } else {
      pages.value = []
      console.log('⚠️ No pages found, using empty array')
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل الصفحات:', error)
    
    // Get saved statuses
    let savedStatuses = {}
    try {
      const statusResult = await $fetch('/api/content/statuses')
      if (statusResult && statusResult.data && statusResult.data.statuses) {
        savedStatuses = statusResult.data.statuses
        console.log('📄 Loaded saved statuses:', savedStatuses)
      }
    } catch (statusError) {
      console.log('⚠️ Could not load saved statuses, using defaults')
    }
    
    // بيانات الصفحات الرئيسية للموقع مع الحالات المحفوظة
    pages.value = [
      {
        id: 1,
        title_ar: 'الصفحة الرئيسية',
        title_en: 'Home Page',
        content_ar: 'الصفحة الرئيسية لموقع وكالة السفر',
        content_en: 'Main homepage of the travel agency website',
        type: 'page',
        status: savedStatuses[1] || 'published',
        url: '/',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title_ar: 'الباقات السياحية',
        title_en: 'Travel Packages',
        content_ar: 'عرض جميع الباقات السياحية المتاحة',
        content_en: 'View all available travel packages',
        type: 'page',
        status: savedStatuses[2] || 'published',
        url: '/packages/',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title_ar: 'باقة مخصصة',
        title_en: 'Custom Package',
        content_ar: 'إنشاء باقة سياحية مخصصة حسب احتياجاتك',
        content_en: 'Create a custom travel package according to your needs',
        type: 'page',
        status: savedStatuses[3] || 'published',
        url: '/custom-package/',
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        title_ar: 'من نحن',
        title_en: 'About Us',
        content_ar: 'تعرف على وكالة السفر وخدماتنا',
        content_en: 'Learn about our travel agency and services',
        type: 'page',
        status: savedStatuses[4] || 'published',
        url: '/about/',
        created_at: new Date(Date.now() - 259200000).toISOString()
      }
    ]
    console.log('📝 Using main website pages data with saved statuses:', pages.value.length, 'pages')
  } finally {
    loading.value = false
  }
}

// تغيير حالة الصفحة
const togglePageStatus = async (page) => {
  try {
    const newStatus = page.status === 'published' ? 'draft' : 'published'
    const actionText = newStatus === 'published' ? 'نشر' : 'إلغاء نشر'
    
    console.log(`🔄 تغيير حالة الصفحة ${page.id} من ${page.status} إلى ${newStatus}`)
    
    // Add to loading state
    togglingStatus.value.add(page.id)
    
    // Show confirmation for unpublishing
    if (newStatus === 'draft') {
      if (!confirm(`هل أنت متأكد من ${actionText} هذه الصفحة؟`)) {
        console.log('❌ تم إلغاء العملية')
        togglingStatus.value.delete(page.id)
        return
      }
    }
    
    // Update via API
    const response = await $fetch(`/api/content/${page.id}/status`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    console.log('📡 استجابة API:', response)
    
    if (response.success) {
      // Update local state
      const index = pages.value.findIndex(p => p.id === page.id)
      if (index !== -1) {
        pages.value[index].status = newStatus
        console.log(`✅ تم تحديث حالة الصفحة محلياً إلى ${newStatus}`)
      }
      
      // Show success notification
      showNotification(`تم ${actionText} الصفحة بنجاح`, 'success')
      console.log(`✅ تم ${actionText} الصفحة بنجاح`)
      
             // Refresh navigation to reflect changes
             try {
               await $fetch('/api/public/navigation/refresh', { method: 'POST' })
               console.log('🔄 تم تحديث التنقل')
               
               // Also refresh navigation in the frontend
               const { refreshAllNavigation } = useNavigationRefresh()
               await refreshAllNavigation()
               console.log('🔄 تم تحديث التنقل في الواجهة الأمامية')
             } catch (navError) {
               console.log('⚠️ لم يتم تحديث التنقل:', navError)
             }
    }
  } catch (error) {
    console.error('❌ خطأ في تغيير حالة الصفحة:', error)
    // Fallback to local update
    const newStatus = page.status === 'published' ? 'draft' : 'published'
    const index = pages.value.findIndex(p => p.id === page.id)
    if (index !== -1) {
      pages.value[index].status = newStatus
      console.log(`✅ تم تحديث حالة الصفحة محلياً إلى ${newStatus}`)
    }
    
    // Show fallback notification
    showNotification(`تم تحديث حالة الصفحة محلياً`, 'warning')
    
    // Try to refresh navigation even in fallback mode
    try {
      await $fetch('/api/public/navigation/refresh', { method: 'POST' })
      console.log('🔄 تم تحديث التنقل (fallback)')
    } catch (navError) {
      console.log('⚠️ لم يتم تحديث التنقل (fallback):', navError)
    }
  } finally {
    // Remove from loading state
    togglingStatus.value.delete(page.id)
  }
}

// حذف الصفحة
const deletePage = async (page) => {
  if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    const response = await $fetch(`/api/content/${page.id}`, { method: 'DELETE' })
    
    if (response.success) {
      // Remove from local list
      pages.value = pages.value.filter(p => p.id !== page.id)
      console.log('تم حذف الصفحة بنجاح')
    }
  } catch (error) {
    console.error('خطأ في حذف الصفحة:', error)
    // Fallback to local deletion
    pages.value = pages.value.filter(p => p.id !== page.id)
    console.log('تم حذف الصفحة محلياً')
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
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

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, statusFilter, typeFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(async () => {
  // التأكد من أن المستخدم مصادق عليه قبل تحميل البيانات
  const { checkAuth } = useAuth()
  try {
    await checkAuth(true)
    await loadPages()
  } catch (error) {
    console.error('خطأ في تحميل بيانات المحتوى:', error)
  }
})

// SEO والميتا
useHead({
  title: 'إدارة المحتوى - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة صفحات الموقع والمحتوى' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

