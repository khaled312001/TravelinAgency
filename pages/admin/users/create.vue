<template>
  <div class="space-y-6">
    <!-- رأس الصفحة -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة مستخدم جديد</h1>
        <p class="text-gray-600 mt-1">إنشاء حساب مستخدم جديد في النظام</p>
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
          @click="createUser"
          :disabled="isLoading || !isFormValid"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon 
            name="material-symbols:add" 
            class="h-4 w-4 ml-2"
            :class="{ 'animate-spin': isLoading }"
          />
          {{ isLoading ? 'جاري الإنشاء...' : 'إنشاء المستخدم' }}
        </button>
      </div>
    </div>

    <!-- نموذج الإنشاء -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور *</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور *</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أعد إدخال كلمة المرور"
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

        <!-- الإعدادات الافتراضية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإعدادات الافتراضية</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
              <select
                v-model="defaultPreferences.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
              <select
                v-model="defaultPreferences.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- الإشعارات الافتراضية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الإشعارات الافتراضية</h2>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="defaultPreferences.notifications.email"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">إشعارات البريد الإلكتروني</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="defaultPreferences.notifications.sms"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">إشعارات الرسائل النصية</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="defaultPreferences.notifications.push"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="mr-2 text-sm text-gray-700">الإشعارات الفورية</span>
            </label>
          </div>
        </div>

        <!-- الخصوصية الافتراضية -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">الخصوصية الافتراضية</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رؤية الملف الشخصي</label>
              <select
                v-model="defaultPreferences.privacy.profile_visibility"
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
                  v-model="defaultPreferences.privacy.show_email"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">إظهار البريد الإلكتروني</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="defaultPreferences.privacy.show_phone"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">إظهار رقم الهاتف</span>
              </label>
            </div>
          </div>
        </div>

        <!-- ملخص المعلومات -->
        <div class="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">ملخص المعلومات</h3>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex justify-between">
              <span>الاسم:</span>
              <span>{{ form.full_name || 'غير محدد' }}</span>
            </div>
            <div class="flex justify-between">
              <span>البريد:</span>
              <span>{{ form.email || 'غير محدد' }}</span>
            </div>
            <div class="flex justify-between">
              <span>الدور:</span>
              <span>{{ getRoleName(form.role) }}</span>
            </div>
            <div class="flex justify-between">
              <span>الحالة:</span>
              <span>{{ getStatusName(form.status) }}</span>
            </div>
            <div class="flex justify-between">
              <span>الهاتف:</span>
              <span>{{ form.phone || 'غير محدد' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateUserRequest } from '~/types/user'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const isLoading = ref(false)
const confirmPassword = ref('')

// نموذج البيانات
const form = ref<CreateUserRequest>({
  email: '',
  password: '',
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
  postal_code: ''
})

// الإعدادات الافتراضية
const defaultPreferences = ref({
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
})

// التحقق من صحة النموذج
const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         form.value.full_name &&
         form.value.password === confirmPassword.value &&
         form.value.password.length >= 6
})

// إنشاء المستخدم
const createUser = async () => {
  try {
    isLoading.value = true
    
    // إضافة الإعدادات الافتراضية للنموذج
    const userData = {
      ...form.value,
      preferences: defaultPreferences.value
    }
    
    const response = await $fetch('/api/admin/users', {
      method: 'POST',
      body: userData
    })
    
    if (response.success) {
      // إشعار النجاح
      console.log('تم إنشاء المستخدم بنجاح')
      
      // التنقل إلى صفحة تعديل المستخدم الجديد
      await navigateTo(`/admin/users/${response.data?.id}/edit`)
    } else {
      throw new Error(response.error || 'فشل في إنشاء المستخدم')
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    // يمكن إضافة إشعار خطأ هنا
  } finally {
    isLoading.value = false
  }
}

// دوال المساعدة
const getRoleName = (role: string) => {
  const roles = {
    admin: 'مدير',
    moderator: 'مشرف',
    user: 'مستخدم'
  }
  return roles[role as keyof typeof roles] || role
}

const getStatusName = (status: string) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statuses[status as keyof typeof statuses] || status
}

// SEO والميتا
useHead({
  title: 'إضافة مستخدم جديد - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إنشاء حساب مستخدم جديد في النظام' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>


