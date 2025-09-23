<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة الباقات السياحية</h1>
        <p class="mt-1 text-sm text-gray-600">إدارة وتحرير الباقات السياحية المتاحة</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <button
          @click="exportPackages"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:download" class="h-5 w-5 ml-2" />
          تصدير البيانات
        </button>
        <NuxtLink
          to="/admin/packages/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة حزمة جديدة
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
            placeholder="البحث في الحزم..."
            class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- تصفية حسب الحالة -->
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="draft">مسودة</option>
        </select>

        <!-- تصفية حسب الفئة -->
        <select
          v-model="categoryFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الفئات</option>
          <option value="domestic">محلي</option>
          <option value="international">دولي</option>
          <option value="religious">ديني</option>
          <option value="adventure">مغامرة</option>
        </select>
      </div>
    </div>

    <!-- قائمة الباقات -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الحزم...</span>
      </div>

      <!-- قائمة الباقات -->
      <div v-else-if="filteredPackages.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحزمة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السعر
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفئة
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
            <tr v-for="pkg in filteredPackages" :key="pkg.id" class="hover:bg-gray-50">
              <!-- معلومات الحزمة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img 
                    :src="pkg.image || pkg.image_url || '/images/placeholder.jpg'" 
                    :alt="pkg.title_ar || pkg.title_en || pkg.title"
                    class="h-12 w-12 rounded-lg object-cover ml-4"
                    loading="lazy"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ pkg.title_ar || pkg.title_en || pkg.title }}</div>
                    <div class="text-sm text-gray-500">{{ truncateText(pkg.description_ar || pkg.description_en || pkg.description, 50) }}</div>
                  </div>
                </div>
              </td>

              <!-- السعر -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatPrice(pkg.price) }}
              </td>

              <!-- الفئة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCategoryColor(pkg.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getCategoryName(pkg.category) }}
                </span>
              </td>

              <!-- الحالة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(pkg.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(pkg.status) }}
                </span>
              </td>

              <!-- تاريخ الإنشاء -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pkg.created_at) }}
              </td>

              <!-- الإجراءات -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <NuxtLink
                    :to="`/admin/packages/${pkg.id}`"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="عرض"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/packages/${pkg.id}/edit`"
                    class="text-green-600 hover:text-green-900 p-1 rounded"
                    title="تحرير"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="togglePackageStatus(pkg)"
                    :class="pkg.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                    class="p-1 rounded"
                    :title="pkg.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل'"
                  >
                    <Icon :name="pkg.status === 'active' ? 'material-symbols:pause' : 'material-symbols:play-arrow'" class="h-4 w-4" />
                  </button>
                  <button
                    @click="deletePackage(pkg)"
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
        <Icon name="material-symbols:package-2-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد حزم</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي حزم سياحية</p>
        <NuxtLink
          to="/admin/packages/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة حزمة جديدة
        </NuxtLink>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} حزمة
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
const packages = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// No Supabase needed - using API endpoints

// المتغيرات المحسوبة
const filteredPackages = computed(() => {
  let filtered = packages.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(pkg => 
      (pkg.title_ar && pkg.title_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.title_en && pkg.title_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.title && pkg.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description_ar && pkg.description_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description_en && pkg.description_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(pkg => pkg.status === statusFilter.value)
  }

  // تصفية الفئة
  if (categoryFilter.value) {
    filtered = filtered.filter(pkg => pkg.category === categoryFilter.value)
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = packages.value

  if (searchQuery.value) {
    filtered = filtered.filter(pkg => 
      (pkg.title_ar && pkg.title_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.title_en && pkg.title_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.title && pkg.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description_ar && pkg.description_ar.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description_en && pkg.description_en.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(pkg => pkg.status === statusFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(pkg => pkg.category === categoryFilter.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// تحميل الحزم
const loadPackages = async () => {
  try {
    loading.value = true
    const result = await $fetch('/api/packages')
    console.log('API Response:', result)
    
    if (result.success && result.data) {
      packages.value = result.data
    } else {
      packages.value = []
    }
  } catch (error) {
    console.error('خطأ في تحميل الحزم:', error)
    // بيانات وهمية للعرض في حالة الخطأ
    packages.value = [
      {
        id: 1,
        title_ar: 'رحلة إلى دبي',
        title_en: 'Dubai Trip',
        description_ar: 'رحلة سياحية مميزة إلى دبي لمدة 5 أيام',
        description_en: 'Amazing 5-day trip to Dubai',
        price: 2500,
        category: 'international',
        status: 'active',
        image: '/images/packages/dubai.jpg',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title_ar: 'عمرة رمضان',
        title_en: 'Ramadan Umrah',
        description_ar: 'برنامج عمرة رمضان المبارك',
        description_en: 'Ramadan Umrah program',
        price: 1800,
        category: 'religious',
        status: 'active',
        image: '/images/packages/umrah.jpg',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

// تغيير حالة الحزمة
const togglePackageStatus = async (pkg) => {
  try {
    const newStatus = pkg.status === 'active' ? 'inactive' : 'active'
    
    // TODO: Add API endpoint for updating package status
    // For now, update locally
    const index = packages.value.findIndex(p => p.id === pkg.id)
    if (index !== -1) {
      packages.value[index].status = newStatus
    }

    // إشعار بالنجاح
    console.log(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الحزمة بنجاح`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الحزمة:', error)
  }
}

// حذف الحزمة
const deletePackage = async (pkg) => {
  if (!confirm('هل أنت متأكد من حذف هذه الحزمة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' })
    
    // Remove from local list
    packages.value = packages.value.filter(p => p.id !== pkg.id)
    
    console.log('تم حذف الحزمة بنجاح')
  } catch (error) {
    console.error('خطأ في حذف الحزمة:', error)
  }
}

// تصدير البيانات
const exportPackages = () => {
  try {
    const { exportPackagesToExcel } = useExcelExport()
    const success = exportPackagesToExcel(packages.value)
    if (success) {
      console.log('تم تصدير الحزم بنجاح')
    } else {
      console.error('فشل في تصدير الحزم')
    }
  } catch (error) {
    console.error('خطأ في تصدير الحزم:', error)
  }
}

// دوال المساعدة
const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getCategoryName = (category) => {
  const categories = {
    domestic: 'محلي',
    international: 'دولي',
    religious: 'ديني',
    adventure: 'مغامرة'
  }
  return categories[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    domestic: 'bg-blue-100 text-blue-800',
    international: 'bg-green-100 text-green-800',
    religious: 'bg-purple-100 text-purple-800',
    adventure: 'bg-orange-100 text-orange-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    draft: 'مسودة'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, statusFilter, categoryFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPackages()
})

// SEO والميتا
useHead({
  title: 'إدارة الباقات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة وتحرير الباقات السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
