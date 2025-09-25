<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <AdminPageHeader 
      title="إدارة الباقات السياحية"
      description="إدارة وتحرير الباقات السياحية المتاحة"
    >
      <template #actions>
        <button
          @click="exportPackages"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:download" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">تصدير البيانات</span>
          <span class="sm:hidden">تصدير</span>
        </button>
        <NuxtLink
          to="/admin/packages/images"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:image" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">إدارة الصور</span>
          <span class="sm:hidden">الصور</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/packages/create"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:add" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">إضافة باقة جديدة</span>
          <span class="sm:hidden">إضافة</span>
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <!-- شريط البحث والتصفية -->
    <AdminFilters>
      <AdminSearchInput
        v-model="searchQuery"
        placeholder="البحث في الباقات..."
      />
      <AdminSelect
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="جميع الحالات"
      />
      <AdminSelect
        v-model="categoryFilter"
        :options="categoryOptions"
        placeholder="جميع الفئات"
      />
    </AdminFilters>

    <!-- قائمة الباقات -->
    <AdminTable
      :items="filteredPackages"
      :columns="tableColumns"
      :actions="tableActions"
      :loading="loading"
      empty-icon="material-symbols:package-2-outline"
      empty-title="لا توجد حزم"
      empty-description="لم يتم العثور على أي حزم سياحية"
      :empty-action="{
        label: 'إضافة باقة جديدة',
        icon: 'material-symbols:add',
        class: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
        handler: () => navigateTo('/admin/packages/create')
      }"
    >
      <!-- عمود الباقة -->
      <template #column-title="{ item: pkg }">
        <div class="flex items-center">
          <img 
            :src="pkg.image || pkg.image_url || '/images/placeholder.jpg'" 
            :alt="pkg.title_ar || pkg.title_en || pkg.title"
            class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover ml-3 sm:ml-4 flex-shrink-0"
            loading="lazy"
          />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-gray-900 truncate">{{ pkg.title_ar || pkg.title_en || pkg.title }}</div>
            <div class="text-sm text-gray-500 truncate">{{ truncateText(pkg.description_ar || pkg.description_en || pkg.description, 30) }}</div>
          </div>
        </div>
      </template>

      <!-- عمود الفئة -->
      <template #column-category="{ item: pkg }">
        <span :class="getCategoryColor(pkg.category)" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ getCategoryName(pkg.category) }}
        </span>
      </template>

      <!-- عمود الحالة -->
      <template #column-status="{ item: pkg }">
        <span :class="getStatusColor(pkg.status)" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ getStatusName(pkg.status) }}
        </span>
      </template>

      <!-- عمود السعر -->
      <template #column-price="{ item: pkg }">
        <div>
          <div class="text-sm font-medium text-gray-900">{{ formatPrice(pkg.price) }}</div>
          <div class="text-sm text-gray-500">{{ pkg.currency || 'SAR' }}</div>
        </div>
      </template>

      <!-- عمود تاريخ الإنشاء -->
      <template #column-created_at="{ item: pkg }">
        {{ formatDate(pkg.created_at) }}
      </template>
    </AdminTable>

    <!-- التصفح -->
    <AdminPagination
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      item-name="حزمة"
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

// خيارات التصفية
const statusOptions = computed(() => [
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'draft', label: 'مسودة' }
])

const categoryOptions = computed(() => [
  { value: 'domestic', label: 'محلي' },
  { value: 'international', label: 'دولي' },
  { value: 'religious', label: 'ديني' },
  { value: 'adventure', label: 'مغامرة' }
])

// أعمدة الجدول
const tableColumns = computed(() => [
  { key: 'title', label: 'الباقة' },
  { key: 'category', label: 'الفئة' },
  { key: 'status', label: 'الحالة' },
  { key: 'price', label: 'السعر' },
  { key: 'created_at', label: 'تاريخ الإنشاء' }
])

// إجراءات الجدول
const tableActions = computed(() => [
  {
    key: 'view',
    icon: 'material-symbols:visibility',
    label: 'عرض',
    class: 'text-blue-600 hover:text-blue-900',
    title: 'عرض',
    handler: (pkg) => navigateTo(`/admin/packages/${pkg.id}`)
  },
  {
    key: 'edit',
    icon: 'material-symbols:edit',
    label: 'تحرير',
    class: 'text-green-600 hover:text-green-900',
    title: 'تحرير',
    handler: (pkg) => navigateTo(`/admin/packages/${pkg.id}/edit`)
  },
  {
    key: 'toggle',
    icon: 'material-symbols:play-arrow',
    label: 'تفعيل',
    class: 'text-orange-600 hover:text-orange-900',
    title: 'تفعيل/إلغاء تفعيل',
    handler: (pkg) => togglePackageStatus(pkg)
  },
  {
    key: 'delete',
    icon: 'material-symbols:delete',
    label: 'حذف',
    class: 'text-red-600 hover:text-red-900',
    title: 'حذف',
    handler: (pkg) => deletePackage(pkg)
  }
])

// تحميل الباقات
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
    console.error('خطأ في تحميل الباقات:', error)
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

// تغيير حالة الباقة
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
    console.log(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الباقة بنجاح`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الباقة:', error)
  }
}

// حذف الباقة
const deletePackage = async (pkg) => {
  if (!confirm('هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    await $fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' })
    
    // Remove from local list
    packages.value = packages.value.filter(p => p.id !== pkg.id)
    
    console.log('تم حذف الباقة بنجاح')
  } catch (error) {
    console.error('خطأ في حذف الباقة:', error)
  }
}

// التنقل إلى صفحة التحرير
const navigateToEdit = (packageId) => {
  console.log('Navigating to edit page:', `/admin/packages/${packageId}/edit`)
  navigateTo(`/admin/packages/${packageId}/edit`)
}

// تصدير البيانات
const exportPackages = () => {
  try {
    const { exportPackagesToExcel } = useExcelExport()
    const success = exportPackagesToExcel(packages.value)
    if (success) {
      console.log('تم تصدير الباقات بنجاح')
    } else {
      console.error('فشل في تصدير الباقات')
    }
  } catch (error) {
    console.error('خطأ في تصدير الباقات:', error)
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
