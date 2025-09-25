<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <AdminPageHeader 
      title="إعدادات النظام"
      description="إدارة إعدادات الموقع والنظام"
    >
      <template #actions>
        <button
          @click="saveSettings"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
          {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
        </button>
      </template>
    </AdminPageHeader>

    <!-- تبويبات الإعدادات -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 space-x-reverse px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <Icon :name="tab.icon" class="h-5 w-5 ml-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- إعدادات الموقع العامة -->
        <div v-if="activeTab === 'general'" class="space-y-6">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">شعار الموقع (عربي)</label>
              <input
                v-model="settings.site_tagline_ar"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل شعار الموقع بالعربية"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شعار الموقع (إنجليزي)</label>
              <input
                v-model="settings.site_tagline_en"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter site tagline in English"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شعار الموقع (URL)</label>
            <input
              v-model="settings.site_logo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/images/logo.png"
            />
          </div>
        </div>

        <!-- إعدادات التواصل -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
              <input
                v-model="settings.contact_whatsapp"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+966501234567"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <textarea
              v-model="settings.contact_address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="الرياض، المملكة العربية السعودية"
            ></textarea>
          </div>
        </div>

        <!-- إعدادات وسائل التواصل الاجتماعي -->
        <div v-if="activeTab === 'social'" class="space-y-6">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">سناب شات</label>
              <input
                v-model="settings.social_snapchat"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://snapchat.com/add/wonderland"
              />
            </div>
          </div>
        </div>

        <!-- إعدادات SEO -->
        <div v-if="activeTab === 'seo'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية افتراضية</label>
            <input
              v-model="settings.seo_keywords"
              type="text"
              placeholder="سفر، سياحة، رحلات، السعودية، وكالة سفر"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف افتراضي للصفحات</label>
            <textarea
              v-model="settings.seo_description"
              rows="3"
              placeholder="وصف الموقع الافتراضي لمحركات البحث"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كود Google Analytics</label>
            <input
              v-model="settings.google_analytics"
              type="text"
              placeholder="G-XXXXXXXXXX"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كود Google Tag Manager</label>
            <input
              v-model="settings.google_tag_manager"
              type="text"
              placeholder="GTM-XXXXXXX"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كود Facebook Pixel</label>
            <input
              v-model="settings.facebook_pixel"
              type="text"
              placeholder="123456789012345"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- إعدادات النظام -->
        <div v-if="activeTab === 'system'" class="space-y-6">
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
                <option value="Asia/Dubai">دبي (GMT+4)</option>
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
                <option value="AED">درهم إماراتي (AED)</option>
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

        <!-- إعدادات الأمان -->
        <div v-if="activeTab === 'security'" class="space-y-6">
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

            <div class="flex items-center">
              <input
                v-model="settings.force_https"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="mr-2 text-sm text-gray-700">فرض استخدام HTTPS</label>
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
const activeTab = ref('general')

// تبويبات الإعدادات
const tabs = [
  { id: 'general', name: 'عام', icon: 'material-symbols:settings' },
  { id: 'contact', name: 'التواصل', icon: 'material-symbols:contact-phone' },
  { id: 'social', name: 'وسائل التواصل', icon: 'material-symbols:share' },
  { id: 'seo', name: 'SEO', icon: 'material-symbols:search' },
  { id: 'system', name: 'النظام', icon: 'material-symbols:computer' },
  { id: 'security', name: 'الأمان', icon: 'material-symbols:security' }
]

// إعدادات النظام
const settings = ref({
  // إعدادات الموقع العامة
  site_name_ar: 'Wonder Land',
  site_name_en: 'Wonder Land',
  site_tagline_ar: 'وكالة السفر الرائدة',
  site_tagline_en: 'Leading Travel Agency',
  site_description_ar: 'وكالة سفر رائدة في المملكة العربية السعودية',
  site_description_en: 'Leading travel agency in Saudi Arabia',
  site_logo: '/images/logo.png',
  
  // إعدادات التواصل
  contact_email: 'info@wonderland.com',
  contact_phone: '+966501234567',
  contact_whatsapp: '+966501234567',
  contact_address: 'الرياض، المملكة العربية السعودية',
  website_url: 'https://wonderland.com',
  
  // وسائل التواصل الاجتماعي
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  social_youtube: '',
  social_linkedin: '',
  social_snapchat: '',
  
  // إعدادات SEO
  seo_keywords: 'سفر، سياحة، رحلات، السعودية، وكالة سفر',
  seo_description: 'اكتشف أفضل الوجهات السياحية مع Wonder Land وكالة السفر الرائدة في المملكة العربية السعودية',
  google_analytics: '',
  google_tag_manager: '',
  facebook_pixel: '',
  
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
  log_activities: true,
  force_https: true
})

// استخدام composable الإعدادات
const { loadSettings: loadSettingsFromComposable, updateSettings } = useSettings()

// تحميل الإعدادات
const loadSettings = async () => {
  try {
    const loadedSettings = await loadSettingsFromComposable(false)
    
    // تحديث الإعدادات المحلية
    Object.keys(settings.value).forEach(key => {
      if (loadedSettings.hasOwnProperty(key)) {
        const value = loadedSettings[key]
        
        // تحويل القيم حسب النوع
        if (key.includes('mode') || key.includes('allow') || key.includes('enable') || key.includes('require') || key.includes('force') || key.includes('log')) {
          settings.value[key] = value === 'true' || value === '1'
        } else if (key.includes('timeout') || key.includes('attempts') || key.includes('page')) {
          settings.value[key] = parseInt(value) || 0
        } else {
          settings.value[key] = value || ''
        }
      }
    })
  } catch (error) {
    console.error('خطأ في تحميل الإعدادات:', error)
  }
}

// حفظ الإعدادات
const saveSettings = async () => {
  try {
    saving.value = true
    
    // تحويل الإعدادات إلى تنسيق API
    const flatSettings = []
    
    Object.keys(settings.value).forEach(key => {
      const value = settings.value[key]
      let settingType = 'text'
      
      // تحديد نوع الإعداد
      if (typeof value === 'boolean') {
        settingType = 'boolean'
      } else if (typeof value === 'number') {
        settingType = 'number'
      } else if (key.includes('description') || key.includes('address')) {
        settingType = 'textarea'
      }
      
      // تحديد الفئة
      let category = 'general'
      if (key.startsWith('contact_') || key.includes('email') || key.includes('phone') || key.includes('address')) {
        category = 'contact'
      } else if (key.startsWith('social_')) {
        category = 'social'
      } else if (key.startsWith('seo_') || key.includes('analytics') || key.includes('pixel')) {
        category = 'seo'
      } else if (key.includes('language') || key.includes('currency') || key.includes('timezone') || key.includes('page') || key.includes('maintenance') || key.includes('registration') || key.includes('notifications')) {
        category = 'system'
      } else if (key.includes('session') || key.includes('login') || key.includes('2fa') || key.includes('captcha') || key.includes('log') || key.includes('https')) {
        category = 'security'
      }
      
      flatSettings.push({
        setting_key: key,
        setting_value: value.toString(),
        setting_type: settingType,
        category: category,
        description: getSettingDescription(key),
        is_public: category !== 'security' && !key.includes('admin')
      })
    })
    
    await $fetch('/api/cms/site-settings', {
      method: 'PUT',
      body: { settings: flatSettings }
    })
    
    // تحديث الإعدادات في الـ composable
    await updateSettings(settings.value)
    
    // إظهار رسالة النجاح
    alert('تم حفظ الإعدادات بنجاح')
    
  } catch (error) {
    console.error('خطأ في حفظ الإعدادات:', error)
    alert('حدث خطأ أثناء حفظ الإعدادات')
  } finally {
    saving.value = false
  }
}

// الحصول على وصف الإعداد
const getSettingDescription = (key) => {
  const descriptions = {
    site_name_ar: 'اسم الموقع باللغة العربية',
    site_name_en: 'اسم الموقع باللغة الإنجليزية',
    site_tagline_ar: 'شعار الموقع باللغة العربية',
    site_tagline_en: 'شعار الموقع باللغة الإنجليزية',
    site_description_ar: 'وصف الموقع باللغة العربية',
    site_description_en: 'وصف الموقع باللغة الإنجليزية',
    site_logo: 'رابط شعار الموقع',
    contact_email: 'البريد الإلكتروني للتواصل',
    contact_phone: 'رقم الهاتف',
    contact_whatsapp: 'رقم الواتساب',
    contact_address: 'العنوان',
    website_url: 'الموقع الإلكتروني',
    social_facebook: 'رابط صفحة الفيسبوك',
    social_twitter: 'رابط حساب تويتر',
    social_instagram: 'رابط حساب الإنستغرام',
    social_youtube: 'رابط قناة اليوتيوب',
    social_linkedin: 'رابط حساب لينكد إن',
    social_snapchat: 'رابط حساب سناب شات',
    seo_keywords: 'الكلمات المفتاحية الافتراضية',
    seo_description: 'الوصف الافتراضي للصفحات',
    google_analytics: 'كود Google Analytics',
    google_tag_manager: 'كود Google Tag Manager',
    facebook_pixel: 'كود Facebook Pixel',
    default_language: 'اللغة الافتراضية للموقع',
    timezone: 'المنطقة الزمنية',
    default_currency: 'العملة الافتراضية',
    items_per_page: 'عدد العناصر في الصفحة الواحدة',
    maintenance_mode: 'تفعيل وضع الصيانة',
    allow_registration: 'السماح بتسجيل المستخدمين الجدد',
    enable_notifications: 'تفعيل الإشعارات',
    enable_analytics: 'تفعيل التحليلات',
    session_timeout: 'مدة انتهاء الجلسة بالدقائق',
    max_login_attempts: 'عدد محاولات تسجيل الدخول المسموحة',
    require_2fa: 'تفعيل المصادقة الثنائية',
    enable_captcha: 'تفعيل CAPTCHA',
    log_activities: 'تسجيل أنشطة المستخدمين',
    force_https: 'فرض استخدام HTTPS'
  }
  
  return descriptions[key] || `إعداد ${key}`
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