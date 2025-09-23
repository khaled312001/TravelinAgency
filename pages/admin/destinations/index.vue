<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة الوجهات السياحية</h1>
        <p class="mt-1 text-sm text-gray-600">إدارة وتحرير الوجهات السياحية المتاحة</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <button
          @click="exportDestinations"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:download" class="h-5 w-5 ml-2" />
          تصدير البيانات
        </button>
        <NuxtLink
          to="/admin/destinations/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة وجهة جديدة
        </NuxtLink>
      </div>
    </div>

    <!-- شريط البحث والتصفية -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- البحث -->
        <div class="relative">
          <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في الوجهات..."
            class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- تصفية حسب النوع -->
        <select
          v-model="typeFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الأنواع</option>
          <option value="saudi">سعودي</option>
          <option value="international">عالمي</option>
        </select>

        <!-- تصفية حسب الحالة -->
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>
    </div>

    <!-- قائمة الوجهات -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الوجهات...</span>
      </div>

      <!-- قائمة الوجهات -->
      <div v-else-if="filteredDestinations.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوجهة
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
            <tr v-for="destination in filteredDestinations" :key="destination.id" class="hover:bg-gray-50">
              <!-- معلومات الوجهة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img 
                    :src="destination.image || destination.image_url || '/images/placeholder.jpg'" 
                    :alt="destination.name_ar || destination.name_en"
                    class="h-12 w-12 rounded-lg object-cover ml-4"
                    loading="lazy"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ destination.name_ar || destination.name_en || destination.name }}</div>
                    <div class="text-sm text-gray-500">{{ truncateText(destination.description_ar || destination.description_en || destination.description, 50) }}</div>
                  </div>
                </div>
              </td>

              <!-- النوع -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeColor(destination.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getTypeName(destination.category) }}
                </span>
              </td>

              <!-- الحالة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(destination.active ? 'active' : 'inactive')" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(destination.active ? 'active' : 'inactive') }}
                </span>
              </td>

              <!-- تاريخ الإنشاء -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(destination.created_at) }}
              </td>

              <!-- الإجراءات -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <NuxtLink
                    :to="`/admin/destinations/${destination.id}`"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="عرض"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/destinations/${destination.id}/edit`"
                    class="text-green-600 hover:text-green-900 p-1 rounded"
                    title="تحرير"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="toggleDestinationStatus(destination)"
                    :class="destination.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                    class="p-1 rounded"
                    :title="destination.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل'"
                  >
                    <Icon :name="destination.status === 'active' ? 'material-symbols:pause' : 'material-symbols:play-arrow'" class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteDestination(destination)"
                    class="text-red-600 hover:text-red-900 p-1 rounded"
                    title="حذف"
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
        <Icon name="material-symbols:place" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد وجهات</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي وجهات سياحية</p>
        <NuxtLink
          to="/admin/destinations/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة وجهة جديدة
        </NuxtLink>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} وجهة
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
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const destinations = ref([])
const loading = ref(true)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// المتغيرات المحسوبة
const filteredDestinations = computed(() => {
  let filtered = destinations.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(dest => 
      (dest.name_ar && dest.name_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.name_en && dest.name_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.name && dest.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description_ar && dest.description_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description_en && dest.description_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description && dest.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // تصفية النوع
  if (typeFilter.value) {
    filtered = filtered.filter(dest => dest.category === typeFilter.value)
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(dest => {
      const isActive = dest.active === 1 || dest.active === true
      return statusFilter.value === 'active' ? isActive : !isActive
    })
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = destinations.value

  if (searchQuery.value) {
    filtered = filtered.filter(dest => 
      (dest.name_ar && dest.name_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.name_en && dest.name_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.name && dest.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description_ar && dest.description_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description_en && dest.description_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (dest.description && dest.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(dest => dest.type === typeFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(dest => dest.status === statusFilter.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// تحميل الوجهات
const loadDestinations = async () => {
  try {
    loading.value = true
    const result = await $fetch('/api/destinations')
    
    if (result.success && result.data) {
      destinations.value = result.data
    } else {
      destinations.value = []
    }
  } catch (error) {
    console.error('خطأ في تحميل الوجهات:', error)
    // بيانات وهمية للعرض في حالة الخطأ
    destinations.value = [
      {
        id: 1,
        name_ar: 'الرياض',
        name_en: 'Riyadh',
        description_ar: 'عاصمة المملكة العربية السعودية',
        description_en: 'Capital of Saudi Arabia',
        type: 'saudi',
        status: 'active',
        image: '/images/destinations/riyadh/main.jpg',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name_ar: 'دبي',
        name_en: 'Dubai',
        description_ar: 'مدينة الإمارات الرائعة',
        description_en: 'Amazing UAE city',
        type: 'global',
        status: 'active',
        image: '/images/destinations/dubai/main.jpg',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

// تغيير حالة الوجهة
const toggleDestinationStatus = async (dest) => {
  try {
    const newStatus = dest.status === 'active' ? 'inactive' : 'active'
    
    // TODO: Add API endpoint for updating destination status
    const index = destinations.value.findIndex(d => d.id === dest.id)
    if (index !== -1) {
      destinations.value[index].status = newStatus
    }

    console.log(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الوجهة بنجاح`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الوجهة:', error)
  }
}

// حذف الوجهة
const deleteDestination = async (dest) => {
  if (!confirm('هل أنت متأكد من حذف هذه الوجهة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/destinations/${dest.id}`, { method: 'DELETE' })
    
    // Remove from local list
    destinations.value = destinations.value.filter(d => d.id !== dest.id)
    
    console.log('تم حذف الوجهة بنجاح')
  } catch (error) {
    console.error('خطأ في حذف الوجهة:', error)
  }
}

// تصدير البيانات
const exportDestinations = () => {
  try {
    const { exportDestinationsToExcel } = useExcelExport()
    const success = exportDestinationsToExcel(destinations.value)
    if (success) {
      console.log('تم تصدير الوجهات بنجاح')
    } else {
      console.error('فشل في تصدير الوجهات')
    }
  } catch (error) {
    console.error('خطأ في تصدير الوجهات:', error)
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
    saudi: 'سعودي',
    international: 'عالمي'
  }
  return types[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    saudi: 'bg-green-100 text-green-800',
    international: 'bg-blue-100 text-blue-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, typeFilter, statusFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadDestinations()
})

// SEO والميتا
useHead({
  title: 'إدارة الوجهات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة وتحرير الوجهات السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
