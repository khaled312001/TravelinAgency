<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
        <p class="mt-1 text-sm text-gray-600">إدارة إعدادات الموقع والنظام</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="saveSettings"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
          {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
        </button>
      </div>
    </div>

    <!-- إعدادات الموقع -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">إعدادات الموقع</h2>
        <p class="text-sm text-gray-600">إعدادات عامة للموقع</p>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الموقع (عربي)</label>
            <input
              v-model="settings.site_name_ar"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم الموقع بالعربية"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الموقع (إنجليزي)</label>
            <input
              v-model="settings.site_name_en"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter site name in English"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف الموقع (عربي)</label>
            <textarea
              v-model="settings.site_description_ar"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل وصف الموقع بالعربية"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف الموقع (إنجليزي)</label>
            <textarea
              v-model="settings.site_description_en"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter site description in English"
            ></textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              v-model="settings.contact_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="info@wonderland.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="settings.contact_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+966501234567"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <input
              v-model="settings.contact_address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="الرياض، المملكة العربية السعودية"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الموقع الإلكتروني</label>
            <input
              v-model="settings.website_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://wonderland.com"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- إعدادات وسائل التواصل الاجتماعي -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">وسائل التواصل الاجتماعي</h2>
        <p class="text-sm text-gray-600">روابط حسابات وسائل التواصل الاجتماعي</p>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">فيسبوك</label>
            <input
              v-model="settings.social_facebook"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/wonderland"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تويتر</label>
            <input
              v-model="settings.social_twitter"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/wonderland"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">إنستغرام</label>
            <input
              v-model="settings.social_instagram"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/wonderland"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">يوتيوب</label>
            <input
              v-model="settings.social_youtube"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/wonderland"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">لينكد إن</label>
            <input
              v-model="settings.social_linkedin"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/wonderland"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">واتساب</label>
            <input
              v-model="settings.social_whatsapp"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+966501234567"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- إعدادات النظام -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">إعدادات النظام</h2>
        <p class="text-sm text-gray-600">إعدادات تقنية للنظام</p>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اللغة الافتراضية</label>
            <select
              v-model="settings.default_language"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
            <select
              v-model="settings.timezone"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العملة الافتراضية</label>
            <select
              v-model="settings.default_currency"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="EUR">يورو (EUR)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عدد العناصر في الصفحة</label>
            <input
              v-model.number="settings.items_per_page"
              type="number"
              min="10"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center">
            <input
              v-model="settings.maintenance_mode"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">وضع الصيانة</label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="settings.allow_registration"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">السماح بالتسجيل</label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="settings.enable_notifications"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">تفعيل الإشعارات</label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="settings.enable_analytics"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">تفعيل التحليلات</label>
          </div>
        </div>
      </div>
    </div>

    <!-- إعدادات الأمان -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">إعدادات الأمان</h2>
        <p class="text-sm text-gray-600">إعدادات أمان النظام</p>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">مدة انتهاء الجلسة (دقيقة)</label>
            <input
              v-model.number="settings.session_timeout"
              type="number"
              min="15"
              max="1440"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عدد محاولات تسجيل الدخول</label>
            <input
              v-model.number="settings.max_login_attempts"
              type="number"
              min="3"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center">
            <input
              v-model="settings.require_2fa"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">تفعيل المصادقة الثنائية</label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="settings.enable_captcha"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">تفعيل CAPTCHA</label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="settings.log_activities"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="mr-2 text-sm text-gray-700">تسجيل الأنشطة</label>
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

// إعدادات النظام
const settings = ref({
  // إعدادات الموقع
  site_name_ar: 'Wonder Land',
  site_name_en: 'Wonder Land',
  site_description_ar: 'وكالة سفر رائدة في المملكة العربية السعودية',
  site_description_en: 'Leading travel agency in Saudi Arabia',
  contact_email: 'info@wonderland.com',
  contact_phone: '+966501234567',
  contact_address: 'الرياض، المملكة العربية السعودية',
  website_url: 'https://wonderland.com',
  
  // وسائل التواصل الاجتماعي
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  social_youtube: '',
  social_linkedin: '',
  social_whatsapp: '',
  
  // إعدادات النظام
  default_language: 'ar',
  timezone: 'Asia/Riyadh',
  default_currency: 'SAR',
  items_per_page: 20,
  maintenance_mode: false,
  allow_registration: true,
  enable_notifications: true,
  enable_analytics: true,
  
  // إعدادات الأمان
  session_timeout: 60,
  max_login_attempts: 5,
  require_2fa: false,
  enable_captcha: false,
  log_activities: true
})

// تحميل الإعدادات
const loadSettings = async () => {
  try {
    const result = await $fetch('/api/settings')
    if (result && result.settings) {
      settings.value = { ...settings.value, ...result.settings }
    }
  } catch (error) {
    console.error('خطأ في تحميل الإعدادات:', error)
  }
}

// حفظ الإعدادات
const saveSettings = async () => {
  try {
    saving.value = true
    
    await $fetch('/api/settings', {
      method: 'PUT',
      body: { settings: settings.value }
    })
    
    console.log('تم حفظ الإعدادات بنجاح')
  } catch (error) {
    console.error('خطأ في حفظ الإعدادات:', error)
  } finally {
    saving.value = false
  }
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadSettings()
})

// SEO والميتا
useHead({
  title: 'إعدادات النظام - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة إعدادات الموقع والنظام' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>