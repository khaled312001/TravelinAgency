<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <AdminPageHeader 
      title="إدارة المستخدمين"
      description="إدارة وتحرير المستخدمين المسجلين"
    >
      <template #actions>
        <button
          @click="exportUsers"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:download" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">تصدير البيانات</span>
          <span class="sm:hidden">تصدير</span>
        </button>
        <NuxtLink
          to="/admin/users/create"
          class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Icon name="material-symbols:add" class="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          <span class="hidden sm:inline">إضافة مستخدم جديد</span>
          <span class="sm:hidden">إضافة</span>
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <!-- إحصائيات سريعة -->
    <AdminStats :stats="userStats" />

    <!-- شريط البحث والتصفية -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- البحث -->
        <div class="relative">
          <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في المستخدمين..."
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
          <option value="suspended">معلق</option>
        </select>

        <!-- تصفية حسب الدور -->
        <select
          v-model="roleFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع الأدوار</option>
          <option value="admin">مدير</option>
          <option value="moderator">مشرف</option>
          <option value="user">مستخدم</option>
        </select>

        <!-- تصفية حسب التاريخ -->
        <select
          v-model="dateFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">جميع التواريخ</option>
          <option value="today">اليوم</option>
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
        </select>
      </div>
    </div>

    <!-- قائمة المستخدمين -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- حالة التحميل -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل المستخدمين...</span>
      </div>

      <!-- قائمة المستخدمين -->
      <div v-else-if="filteredUsers.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدم
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدور
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ التسجيل
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <!-- معلومات المستخدم -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <Icon name="material-symbols:person" class="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.full_name || user.name || 'غير محدد' }}</div>
                    <div class="text-sm text-gray-500">{{ user.phone || 'لا يوجد رقم هاتف' }}</div>
                  </div>
                </div>
              </td>

              <!-- البريد الإلكتروني -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500">
                  {{ user.email_verified ? 'مؤكد' : 'غير مؤكد' }}
                </div>
              </td>

              <!-- الدور -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleName(user.role) }}
                </span>
              </td>

              <!-- الحالة -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(user.status) }}
                </span>
              </td>

              <!-- تاريخ التسجيل -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>

              <!-- الإجراءات -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="عرض"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/users/${user.id}/edit`"
                    class="text-green-600 hover:text-green-900 p-1 rounded"
                    title="تحرير"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                    class="p-1 rounded"
                    :title="user.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل'"
                  >
                    <Icon :name="user.status === 'active' ? 'material-symbols:pause' : 'material-symbols:play-arrow'" class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteUser(user)"
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
        <Icon name="material-symbols:people" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا يوجد مستخدمون</h3>
        <p class="text-gray-500 mb-6">لم يتم العثور على أي مستخدمين</p>
        <NuxtLink
          to="/admin/users/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="material-symbols:add" class="h-5 w-5 ml-2" />
          إضافة مستخدم جديد
        </NuxtLink>
      </div>
    </div>

    <!-- التصفح -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} مستخدم
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

// استخدام composable المستخدمين
const {
  users,
  isLoading,
  error,
  userStats,
  fetchUsers,
  deleteUser,
  toggleUserStatus,
  getRoleName,
  getRoleColor,
  getStatusName,
  getStatusColor,
  formatDate
} = useUsers()

// المتغيرات التفاعلية
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// المتغيرات المحسوبة
const filteredUsers = computed(() => {
  let filtered = users.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // تصفية الحالة
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // تصفية الدور
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // تصفية التاريخ
  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(user => {
      const userDate = new Date(user.created_at)
      switch (dateFilter.value) {
        case 'today':
          return userDate >= today
        case 'week':
          return userDate >= weekAgo
        case 'month':
          return userDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const totalItems = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    filtered = filtered.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(user => {
      const userDate = new Date(user.created_at)
      switch (dateFilter.value) {
        case 'today':
          return userDate >= today
        case 'week':
          return userDate >= weekAgo
        case 'month':
          return userDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// userStats is imported from useUsers() composable

// تحميل المستخدمين
const loadUsers = async () => {
  try {
    await fetchUsers()
  } catch (error) {
    console.error('خطأ في تحميل المستخدمين:', error)
  }
}


// تصدير البيانات
const exportUsers = () => {
  try {
    const { exportUsersToExcel } = useExcelExport()
    const success = exportUsersToExcel(users.value)
    if (success) {
      console.log('تم تصدير المستخدمين بنجاح')
    } else {
      console.error('فشل في تصدير المستخدمين')
    }
  } catch (error) {
    console.error('خطأ في تصدير المستخدمين:', error)
  }
}

// دوال المساعدة

// إعادة تعيين الصفحة عند تغيير الفلاتر
watch([searchQuery, statusFilter, roleFilter, dateFilter], () => {
  currentPage.value = 1
})

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadUsers()
})

// SEO والميتا
useHead({
  title: 'إدارة المستخدمين - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة وتحرير المستخدمين المسجلين' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
