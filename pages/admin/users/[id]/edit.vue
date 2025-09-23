<template>
  <div class="space-y-6">
    <!-- رأس الصفحة -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تعديل المستخدم</h1>
        <p class="text-gray-600 mt-1">تعديل بيانات المستخدم: {{ user?.full_name || 'غير محدد' }}</p>
      </div>
      <div class="flex items-center space-x-3 space-x-reverse">
        <NuxtLink
          to="/admin/users"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon name="material-symbols:arrow-back" class="h-4 w-4 ml-2" />
          العودة
        </NuxtLink>
        <button
          @click="saveUser"
          :disabled="isLoading || !isFormValid"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon 
            name="material-symbols:save" 
            class="h-4 w-4 ml-2"
            :class="{ 'animate-spin': isLoading }"
          />
          {{ isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل بيانات المستخدم...</span>
    </div>

    <!-- نموذج التعديل -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- المعلومات الأساسية -->
      <div class="lg:col-span-2 space-y-6">
        <!-- المعلومات الشخصية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
              <input
                v-model="form.full_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+966501234567"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
              <input
                v-model="form.date_of_birth"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
              <select
                v-model="form.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
                <option value="other">آخر</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الجنسية</label>
              <input
                v-model="form.nationality"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="الجنسية"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">نبذة شخصية</label>
            <textarea
              v-model="form.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل نبذة شخصية"
            ></textarea>
          </div>
        </div>

        <!-- العنوان -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">العنوان</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">العنوان الكامل</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل العنوان الكامل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
              <input
                v-model="form.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="المدينة"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البلد</label>
              <input
                v-model="form.country"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="البلد"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
              <input
                v-model="form.postal_code"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="الرمز البريدي"
              />
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
              <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
              <select
                v-model="form.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">مستخدم</option>
                <option value="moderator">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
          </div>
        </div>

        <!-- الإعدادات -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
              <select
                v-model="form.preferences.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
              <select
                v-model="form.preferences.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- الإشعارات -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإشعارات</h2>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="form.preferences.notifications.email"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">إشعارات البريد الإلكتروني</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.preferences.notifications.sms"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">إشعارات الرسائل النصية</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.preferences.notifications.push"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">الإشعارات الفورية</span>
            </label>
          </div>
        </div>

        <!-- الخصوصية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الخصوصية</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رؤية الملف الشخصي</label>
              <select
                v-model="form.preferences.privacy.profile_visibility"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">عام</option>
                <option value="private">خاص</option>
                <option value="friends">الأصدقاء فقط</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="form.preferences.privacy.show_email"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">إظهار البريد الإلكتروني</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.preferences.privacy.show_phone"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">إظهار رقم الهاتف</span>
              </label>
            </div>
          </div>
        </div>

        <!-- معلومات إضافية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h2>
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
            <div class="flex justify-between">
              <span>البريد مؤكد:</span>
              <span class="flex items-center">
                <Icon 
                  :name="user.email_verified ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                  :class="user.email_verified ? 'text-green-500' : 'text-red-500'"
                  class="h-4 w-4 ml-1"
                />
                {{ user.email_verified ? 'نعم' : 'لا' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>الهاتف مؤكد:</span>
              <span class="flex items-center">
                <Icon 
                  :name="user.phone_verified ? 'material-symbols:check-circle' : 'material-symbols:cancel'" 
                  :class="user.phone_verified ? 'text-green-500' : 'text-red-500'"
                  class="h-4 w-4 ml-1"
                />
                {{ user.phone_verified ? 'نعم' : 'لا' }}
              </span>
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
import type { User, UpdateUserRequest } from '~/types/user'

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
const isLoading = ref(false)

// نموذج البيانات
const form = ref<UpdateUserRequest>({
  email: '',
  full_name: '',
  phone: '',
  role: 'user',
  status: 'active',
  bio: '',
  date_of_birth: '',
  gender: 'male',
  nationality: '',
  address: '',
  city: '',
  country: '',
  postal_code: '',
  preferences: {
    language: 'ar',
    timezone: 'Asia/Riyadh',
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    privacy: {
      profile_visibility: 'public',
      show_email: false,
      show_phone: false
    }
  }
})

// التحقق من صحة النموذج
const isFormValid = computed(() => {
  return form.value.email && form.value.full_name
})

// تحميل بيانات المستخدم
const loadUser = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/admin/users/${userId}`)
    
    if (response.success && response.data) {
      user.value = response.data
      
      // ملء النموذج بالبيانات الحالية
      form.value = {
        email: response.data.email,
        full_name: response.data.full_name || '',
        phone: response.data.phone || '',
        role: response.data.role,
        status: response.data.status,
        bio: response.data.bio || '',
        date_of_birth: response.data.date_of_birth || '',
        gender: response.data.gender || 'male',
        nationality: response.data.nationality || '',
        address: response.data.address || '',
        city: response.data.city || '',
        country: response.data.country || '',
        postal_code: response.data.postal_code || '',
        preferences: {
          language: response.data.preferences?.language || 'ar',
          timezone: response.data.preferences?.timezone || 'Asia/Riyadh',
          notifications: {
            email: response.data.preferences?.notifications?.email ?? true,
            sms: response.data.preferences?.notifications?.sms ?? true,
            push: response.data.preferences?.notifications?.push ?? true
          },
          privacy: {
            profile_visibility: response.data.preferences?.privacy?.profile_visibility || 'public',
            show_email: response.data.preferences?.privacy?.show_email ?? false,
            show_phone: response.data.preferences?.privacy?.show_phone ?? false
          }
        }
      }
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

// حفظ التغييرات
const saveUser = async () => {
  try {
    isLoading.value = true
    
    const response = await $fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: form.value
    })
    
    if (response.success) {
      // تحديث البيانات المحلية
      if (user.value) {
        Object.assign(user.value, response.data)
      }
      
      // إشعار النجاح
      console.log('تم تحديث بيانات المستخدم بنجاح')
      
      // يمكن إضافة إشعار نجاح هنا
    } else {
      throw new Error(response.error || 'فشل في تحديث بيانات المستخدم')
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    // يمكن إضافة إشعار خطأ هنا
  } finally {
    isLoading.value = false
  }
}

// دالة تنسيق التاريخ
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

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadUser()
})

// SEO والميتا
useHead({
  title: `تعديل المستخدم - Wonder Land Admin`,
  meta: [
    { name: 'description', content: 'تعديل بيانات المستخدم' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>


