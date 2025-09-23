<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
        <p class="text-gray-600">إدارة صفحات الموقع والمحتوى</p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <NuxtLink
          to="/admin/cms/pages/new"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          صفحة جديدة
        </NuxtLink>
        <NuxtLink
          to="/admin/cms/settings"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
        >
          <Icon name="material-symbols:settings" class="h-5 w-5 ml-2" />
          إعدادات الموقع
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:description" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي الصفحات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalPages }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <Icon name="material-symbols:visibility" class="h-6 w-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">صفحات منشورة</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.publishedPages }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <Icon name="material-symbols:edit" class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">مسودات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.draftPages }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:menu" class="h-6 w-6 text-purple-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">عناصر القائمة</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.menuItems }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/cms/pages"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="material-symbols:description" class="h-8 w-8 text-blue-600 ml-3" />
            <div>
              <h3 class="font-medium text-gray-900">إدارة الصفحات</h3>
              <p class="text-sm text-gray-600">تعديل وإنشاء صفحات الموقع</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/cms/navigation"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="material-symbols:menu" class="h-8 w-8 text-green-600 ml-3" />
            <div>
              <h3 class="font-medium text-gray-900">إدارة القوائم</h3>
              <p class="text-sm text-gray-600">تعديل قوائم التنقل</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/cms/homepage"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="material-symbols:home" class="h-8 w-8 text-orange-600 ml-3" />
            <div>
              <h3 class="font-medium text-gray-900">الصفحة الرئيسية</h3>
              <p class="text-sm text-gray-600">تعديل محتوى الصفحة الرئيسية</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/cms/media"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="material-symbols:image" class="h-8 w-8 text-purple-600 ml-3" />
            <div>
              <h3 class="font-medium text-gray-900">مكتبة الوسائط</h3>
              <p class="text-sm text-gray-600">إدارة الصور والملفات</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Pages -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">الصفحات الأخيرة</h2>
          <NuxtLink
            to="/admin/cms/pages"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            عرض الكل
          </NuxtLink>
        </div>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <Icon name="material-symbols:refresh" class="h-8 w-8 text-gray-400 animate-spin mx-auto" />
          <p class="text-gray-600 mt-2">جاري التحميل...</p>
        </div>
        
        <div v-else-if="recentPages.length === 0" class="text-center py-8">
          <Icon name="material-symbols:description" class="h-12 w-12 text-gray-400 mx-auto" />
          <p class="text-gray-600 mt-2">لا توجد صفحات بعد</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="page in recentPages"
            :key="page.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg ml-3">
                <Icon name="material-symbols:description" class="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ page.title }}</h3>
                <p class="text-sm text-gray-600">{{ page.slug }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 space-x-reverse">
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
              <NuxtLink
                :to="`/admin/cms/pages/${page.id}`"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                تعديل
              </NuxtLink>
            </div>
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
const stats = ref({
  totalPages: 0,
  publishedPages: 0,
  draftPages: 0,
  menuItems: 0
})
const recentPages = ref([])

// Methods
const getStatusText = (status) => {
  const statusMap = {
    published: 'منشور',
    draft: 'مسودة',
    archived: 'مؤرشف'
  }
  return statusMap[status] || status
}

const loadStats = async () => {
  try {
    // Load pages stats
    const pagesResponse = await $fetch('/api/cms/pages?limit=1000')
    const pages = pagesResponse.data.pages
    
    stats.value.totalPages = pages.length
    stats.value.publishedPages = pages.filter(p => p.status === 'published').length
    stats.value.draftPages = pages.filter(p => p.status === 'draft').length
    
    // Load navigation stats
    const navResponse = await $fetch('/api/cms/navigation')
    const navItems = navResponse.data.flat
    stats.value.menuItems = navItems.length
    
    // Get recent pages
    recentPages.value = pages
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      
  } catch (error) {
    console.error('Error loading CMS stats:', error)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadStats()
})
</script>
