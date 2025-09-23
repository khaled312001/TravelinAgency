<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
        <p class="mt-1 text-sm text-gray-600">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- معلومات الملف الشخصي -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-center">
            <!-- صورة الملف الشخصي -->
            <div class="relative inline-block">
              <div class="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-4">
                <Icon name="material-symbols:person" class="h-12 w-12 text-gray-600" />
              </div>
              <button class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                <Icon name="material-symbols:camera-alt" class="h-4 w-4" />
              </button>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900">{{ userProfile.full_name || 'غير محدد' }}</h3>
            <p class="text-sm text-gray-500">{{ userProfile.email }}</p>
            <p class="text-sm text-gray-500">{{ userProfile.role || 'مدير' }}</p>
            
            <div class="mt-4">
              <span :class="getStatusColor(userProfile.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                {{ getStatusName(userProfile.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- إحصائيات سريعة -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">إحصائيات الحساب</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">تاريخ الانضمام</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(userProfile.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">آخر تسجيل دخول</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(userProfile.last_login) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">عدد الجلسات</span>
              <span class="text-sm font-medium text-gray-900">{{ userProfile.sessions_count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- إعدادات الحساب -->
      <div class="lg:col-span-2">
        <div class="space-y-6">
          <!-- المعلومات الشخصية -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">المعلومات الشخصية</h3>
              <button
                @click="editPersonalInfo = !editPersonalInfo"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {{ editPersonalInfo ? 'إلغاء' : 'تحرير' }}
              </button>
            </div>

            <form v-if="editPersonalInfo" @submit.prevent="updatePersonalInfo" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                  <input
                    v-model="personalInfoForm.full_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    v-model="personalInfoForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    v-model="personalInfoForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">المنصب</label>
                  <input
                    v-model="personalInfoForm.position"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  @click="editPersonalInfo = false"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
                </button>
              </div>
            </form>

            <div v-else class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">الاسم الكامل</span>
                <span class="text-sm font-medium text-gray-900">{{ userProfile.full_name || 'غير محدد' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">البريد الإلكتروني</span>
                <span class="text-sm font-medium text-gray-900">{{ userProfile.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">رقم الهاتف</span>
                <span class="text-sm font-medium text-gray-900">{{ userProfile.phone || 'غير محدد' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">المنصب</span>
                <span class="text-sm font-medium text-gray-900">{{ userProfile.position || 'غير محدد' }}</span>
              </div>
            </div>
          </div>

          <!-- تغيير كلمة المرور -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">تغيير كلمة المرور</h3>
              <button
                @click="editPassword = !editPassword"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {{ editPassword ? 'إلغاء' : 'تغيير' }}
              </button>
            </div>

            <form v-if="editPassword" @submit.prevent="updatePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الحالية</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  @click="editPassword = false"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {{ saving ? 'جاري التحديث...' : 'تحديث' }}
                </button>
              </div>
            </form>

            <div v-else class="text-sm text-gray-500">
              آخر تحديث لكلمة المرور: {{ formatDate(userProfile.password_updated_at) }}
            </div>
          </div>

          <!-- إعدادات الإشعارات -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">إشعارات البريد الإلكتروني</p>
                  <p class="text-sm text-gray-500">تلقي الإشعارات عبر البريد الإلكتروني</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="notificationSettings.email"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">إشعارات الحجوزات الجديدة</p>
                  <p class="text-sm text-gray-500">تلقي إشعار عند وصول حجز جديد</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="notificationSettings.newBookings"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">إشعارات الرسائل</p>
                  <p class="text-sm text-gray-500">تلقي إشعار عند وصول رسالة جديدة</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="notificationSettings.messages"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div class="mt-6">
              <button
                @click="saveNotificationSettings"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
              </button>
            </div>
          </div>

          <!-- إعدادات الأمان -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">إعدادات الأمان</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">المصادقة الثنائية</p>
                  <p class="text-sm text-gray-500">إضافة طبقة أمان إضافية لحسابك</p>
                </div>
                <button
                  @click="toggle2FA"
                  :class="securitySettings.twoFactor ? 'bg-green-600' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span
                    :class="securitySettings.twoFactor ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </button>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">تسجيل جلسات الدخول</p>
                  <p class="text-sm text-gray-500">تسجيل جميع محاولات تسجيل الدخول</p>
                </div>
                <button
                  @click="securitySettings.loginLogging = !securitySettings.loginLogging"
                  :class="securitySettings.loginLogging ? 'bg-green-600' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span
                    :class="securitySettings.loginLogging ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
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
const saving = ref(false)
const editPersonalInfo = ref(false)
const editPassword = ref(false)

// بيانات المستخدم
const userProfile = ref({
  id: 1,
  email: 'admin@wonderland.com',
  full_name: 'مدير النظام',
  phone: '+966501234567',
  position: 'مدير عام',
  role: 'admin',
  status: 'active',
  created_at: new Date().toISOString(),
  last_login: new Date(Date.now() - 3600000).toISOString(),
  sessions_count: 15,
  password_updated_at: new Date(Date.now() - 86400000 * 7).toISOString()
})

// نماذج البيانات
const personalInfoForm = ref({
  full_name: '',
  email: '',
  phone: '',
  position: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = ref({
  email: true,
  newBookings: true,
  messages: true
})

const securitySettings = ref({
  twoFactor: false,
  loginLogging: true
})

// تحديث المعلومات الشخصية
const updatePersonalInfo = async () => {
  try {
    saving.value = true
    
    // TODO: Add API endpoint for updating user profile
    userProfile.value = { ...userProfile.value, ...personalInfoForm.value }
    
    editPersonalInfo.value = false
    console.log('تم تحديث المعلومات الشخصية بنجاح')
  } catch (error) {
    console.error('خطأ في تحديث المعلومات الشخصية:', error)
  } finally {
    saving.value = false
  }
}

// تحديث كلمة المرور
const updatePassword = async () => {
  try {
    saving.value = true
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيدها غير متطابقتين')
      return
    }
    
    // TODO: Add API endpoint for updating password
    userProfile.value.password_updated_at = new Date().toISOString()
    
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    editPassword.value = false
    
    console.log('تم تحديث كلمة المرور بنجاح')
  } catch (error) {
    console.error('خطأ في تحديث كلمة المرور:', error)
  } finally {
    saving.value = false
  }
}

// حفظ إعدادات الإشعارات
const saveNotificationSettings = async () => {
  try {
    saving.value = true
    
    // TODO: Add API endpoint for saving notification settings
    console.log('تم حفظ إعدادات الإشعارات بنجاح')
  } catch (error) {
    console.error('خطأ في حفظ إعدادات الإشعارات:', error)
  } finally {
    saving.value = false
  }
}

// تفعيل/إلغاء المصادقة الثنائية
const toggle2FA = () => {
  securitySettings.value.twoFactor = !securitySettings.value.twoFactor
  // TODO: Add API endpoint for 2FA toggle
}

// دوال المساعدة
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA')
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    suspended: 'bg-orange-100 text-orange-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// تحميل بيانات المستخدم
const loadUserProfile = async () => {
  try {
    // TODO: Add API endpoint for loading user profile
    // For now, use mock data
    personalInfoForm.value = {
      full_name: userProfile.value.full_name,
      email: userProfile.value.email,
      phone: userProfile.value.phone,
      position: userProfile.value.position
    }
  } catch (error) {
    console.error('خطأ في تحميل بيانات المستخدم:', error)
  }
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadUserProfile()
})

// SEO والميتا
useHead({
  title: 'الملف الشخصي - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة معلوماتك الشخصية وإعدادات الحساب' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
