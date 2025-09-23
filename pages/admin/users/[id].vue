<template>
  <div class="space-y-6">
    <!-- رأس الصفحة -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تفاصيل المستخدم</h1>
        <p class="text-gray-600 mt-1">{{ user?.full_name || 'غير محدد' }}</p>
      </div>
      <div class="flex items-center space-x-3 space-x-reverse">
        <NuxtLink
          to="/admin/users"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon name="material-symbols:arrow-back" class="h-4 w-4 ml-2" />
          العودة
        </NuxtLink>
        <NuxtLink
          :to="`/admin/users/${userId}/edit`"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4 ml-2" />
          تعديل
        </NuxtLink>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل بيانات المستخدم...</span>
    </div>

    <!-- تفاصيل المستخدم -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- المعلومات الأساسية -->
      <div class="lg:col-span-2 space-y-6">
        <!-- الملف الشخصي -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-start space-x-4 space-x-reverse">
            <!-- الصورة الشخصية -->
            <div class="flex-shrink-0">
              <div class="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                <Icon name="material-symbols:person" class="h-10 w-10 text-gray-600" />
              </div>
            </div>
            
            <!-- المعلومات الأساسية -->
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900">{{ user.full_name }}</h2>
              <p class="text-gray-600">{{ user.email }}</p>
              <div class="mt-2 flex items-center space-x-4 space-x-reverse">
                <span :class="getRoleColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleName(user.role) }}
                </span>
                <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(user.status) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- النبذة الشخصية -->
          <div v-if="user.bio" class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">نبذة شخصية</h3>
            <p class="text-gray-600">{{ user.bio }}</p>
          </div>
        </div>

        <!-- المعلومات الشخصية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">الاسم الكامل</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.full_name || 'غير محدد' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.phone || 'غير محدد' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.date_of_birth ? formatDate(user.date_of_birth) : 'غير محدد' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">الجنس</label>
              <p class="mt-1 text-sm text-gray-900">{{ getGenderName(user.gender) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">الجنسية</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.nationality || 'غير محدد' }}</p>
            </div>
          </div>
        </div>

        <!-- العنوان -->
        <div v-if="user.address || user.city || user.country" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">العنوان</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="user.address" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">العنوان الكامل</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.address }}</p>
            </div>
            <div v-if="user.city">
              <label class="block text-sm font-medium text-gray-700">المدينة</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.city }}</p>
            </div>
            <div v-if="user.country">
              <label class="block text-sm font-medium text-gray-700">البلد</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.country }}</p>
            </div>
            <div v-if="user.postal_code">
              <label class="block text-sm font-medium text-gray-700">الرمز البريدي</label>
              <p class="mt-1 text-sm text-gray-900">{{ user.postal_code }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- الشريط الجانبي -->
      <div class="space-y-6">
        <!-- الحالة والدور -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الحالة والدور</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">الدور</label>
              <div class="mt-1">
                <span :class="getRoleColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleName(user.role) }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">الحالة</label>
              <div class="mt-1">
                <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusName(user.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- الإعدادات -->
        <div v-if="user.preferences" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">اللغة:</span>
              <span class="text-gray-900">{{ user.preferences.language === 'ar' ? 'العربية' : 'English' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">المنطقة الزمنية:</span>
              <span class="text-gray-900">{{ user.preferences.timezone }}</span>
            </div>
          </div>
        </div>

        <!-- الإشعارات -->
        <div v-if="user.preferences" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإشعارات</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">البريد الإلكتروني:</span>
              <Icon 
                :name="user.preferences.notifications.email ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.preferences.notifications.email ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">الرسائل النصية:</span>
              <Icon 
                :name="user.preferences.notifications.sms ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.preferences.notifications.sms ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">الإشعارات الفورية:</span>
              <Icon 
                :name="user.preferences.notifications.push ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.preferences.notifications.push ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
          </div>
        </div>

        <!-- الخصوصية -->
        <div v-if="user.preferences" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الخصوصية</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">رؤية الملف الشخصي:</span>
              <span class="text-gray-900">{{ getPrivacyName(user.preferences.privacy.profile_visibility) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">إظهار البريد الإلكتروني:</span>
              <Icon 
                :name="user.preferences.privacy.show_email ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.preferences.privacy.show_email ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">إظهار رقم الهاتف:</span>
              <Icon 
                :name="user.preferences.privacy.show_phone ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.preferences.privacy.show_phone ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
          </div>
        </div>

        <!-- معلومات النظام -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">معلومات النظام</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>تاريخ التسجيل:</span>
              <span>{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span>آخر تحديث:</span>
              <span>{{ formatDate(user.updated_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span>آخر دخول:</span>
              <span>{{ user.last_login ? formatDate(user.last_login) : 'لم يسجل دخول' }}</span>
            </div>
            <div class="flex justify-between">
              <span>عدد مرات الدخول:</span>
              <span>{{ user.login_count || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>البريد مؤكد:</span>
              <Icon 
                :name="user.email_verified ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.email_verified ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
            <div class="flex justify-between items-center">
              <span>الهاتف مؤكد:</span>
              <Icon 
                :name="user.phone_verified ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                :class="user.phone_verified ? 'text-green-500' : 'text-red-500'"
                class="h-4 w-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود المستخدم -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:person-off" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">المستخدم غير موجود</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على المستخدم المطلوب</p>
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
        العودة إلى قائمة المستخدمين
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// الحصول على معرف المستخدم من الرابط
const route = useRoute()
const userId = route.params.id as string

// المتغيرات التفاعلية
const user = ref<User | null>(null)
const loading = ref(true)

// تحميل بيانات المستخدم
const loadUser = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/admin/users/${userId}`)
    
    if (response.success && response.data) {
      user.value = response.data
    } else {
      throw new Error(response.error || 'فشل في تحميل بيانات المستخدم')
    }
  } catch (error: any) {
    console.error('Error loading user:', error)
    // يمكن إضافة إشعار خطأ هنا
  } finally {
    loading.value = false
  }
}

// دوال المساعدة
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRoleName = (role: string) => {
  const roles = {
    admin: 'مدير',
    moderator: 'مشرف',
    user: 'مستخدم'
  }
  return roles[role as keyof typeof roles] || role
}

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status: string) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statuses[status as keyof typeof statuses] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    suspended: 'bg-orange-100 text-orange-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getGenderName = (gender?: string) => {
  const genders = {
    male: 'ذكر',
    female: 'أنثى',
    other: 'آخر'
  }
  return genders[gender as keyof typeof genders] || 'غير محدد'
}

const getPrivacyName = (privacy: string) => {
  const privacies = {
    public: 'عام',
    private: 'خاص',
    friends: 'الأصدقاء فقط'
  }
  return privacies[privacy as keyof typeof privacies] || privacy
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadUser()
})

// SEO والميتا
useHead({
  title: `تفاصيل المستخدم - Wonder Land Admin`,
  meta: [
    { name: 'description', content: 'تفاصيل بيانات المستخدم' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>


