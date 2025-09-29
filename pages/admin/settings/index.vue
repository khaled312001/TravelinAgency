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

          <!-- شعار الموقع -->
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">شعار الموقع</label>
            
            <!-- الشعار الحالي -->
            <div v-if="settings.site_logo" class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">الشعار الحالي:</p>
              <div class="flex items-center space-x-4 space-x-reverse">
                <div class="relative">
                  <img 
                    :src="settings.site_logo" 
                    :alt="settings.site_name_ar"
                    class="w-24 h-24 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    @click="removeLogo"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="حذف الشعار"
                  >
                    ×
                  </button>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-600">تم رفع الشعار بنجاح</p>
                  <p class="text-xs text-gray-500">انقر على منطقة الرفع أدناه لتغيير الشعار</p>
                </div>
              </div>
            </div>
            
            <!-- منطقة رفع الصورة -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div 
                @click="triggerFileInput"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
                class="cursor-pointer"
                :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
              >
                <Icon name="material-symbols:cloud-upload" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p class="text-lg font-medium text-gray-700 mb-2">
                  {{ isDragOver ? 'أفلت الصورة هنا' : 'رفع شعار جديد' }}
                </p>
                <p class="text-sm text-gray-600 mb-2">
                  اسحب وأفلت الصورة هنا أو انقر للاختيار من جهازك
                </p>
                <p class="text-xs text-gray-500">
                  الأنواع المدعومة: JPG, PNG, GIF, WebP (حد أقصى 5MB)
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                />
              </div>
            </div>
            
            <!-- معاينة الصورة الجديدة -->
            <div v-if="imagePreview" class="mt-6 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-3">معاينة الشعار الجديد:</p>
              <div class="flex items-center space-x-4 space-x-reverse">
                <img 
                  :src="imagePreview" 
                  alt="معاينة الشعار"
                  class="w-24 h-24 object-contain border border-gray-300 rounded-lg bg-white"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700">{{ selectedFile?.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile?.size) }}</p>
                  <p class="text-xs text-gray-500 mt-1">انقر على "رفع الشعار" لحفظ التغييرات</p>
                </div>
                <div class="flex flex-col space-y-2">
                  <button
                    @click="uploadImage"
                    :disabled="uploading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Icon v-if="uploading" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2" />
                    {{ uploading ? 'جاري الرفع...' : 'رفع الشعار' }}
                  </button>
                  <button
                    @click="cancelUpload"
                    :disabled="uploading"
                    class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
            
            <!-- شريط التقدم -->
            <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-blue-600 h-3 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            
            <!-- رسائل الحالة -->
            <div v-if="uploadMessage" class="p-4 rounded-lg" :class="uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
              <div class="flex items-center">
                <Icon :name="uploadMessage.type === 'success' ? 'material-symbols:check-circle' : 'material-symbols:error'" class="h-5 w-5 ml-2" />
                {{ uploadMessage.text }}
              </div>
            </div>
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

// متغيرات رفع الصور
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const isDragOver = ref(false)
const uploadMessage = ref(null)

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

// دوال رفع الصور
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file) => {
  // التحقق من نوع الملف
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    showUploadMessage('نوع الملف غير مدعوم. يرجى اختيار صورة من نوع JPG, PNG, GIF, أو WebP.', 'error')
    return
  }

  // التحقق من حجم الملف (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showUploadMessage('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.', 'error')
    return
  }

  selectedFile.value = file
  
  // إنشاء معاينة للصورة
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  // إخفاء رسائل الخطأ السابقة
  uploadMessage.value = null
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  try {
    uploading.value = true
    uploadProgress.value = 0
    uploadMessage.value = null

    const formData = new FormData()
    formData.append('image', selectedFile.value)

    // محاكاة شريط التقدم
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.success) {
      // تحديث رابط الشعار في الإعدادات
      settings.value.site_logo = response.url
      
      // إخفاء المعاينة وإعادة تعيين المتغيرات
      imagePreview.value = ''
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      
      showUploadMessage('تم رفع الشعار بنجاح!', 'success')
      
      // تحديث الإعدادات في الـ composable مباشرة
      await updateSettings({ site_logo: response.url })
      
      // إعادة تحميل الإعدادات في جميع أنحاء الموقع
      await refreshSiteSettings()
    } else {
      showUploadMessage('فشل في رفع الشعار: ' + (response.error || 'خطأ غير معروف'), 'error')
    }
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error)
    showUploadMessage('خطأ في الاتصال: ' + error.message, 'error')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeLogo = () => {
  if (confirm('هل أنت متأكد من حذف الشعار؟')) {
    settings.value.site_logo = ''
    showUploadMessage('تم حذف الشعار', 'success')
  }
}

const cancelUpload = () => {
  imagePreview.value = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  uploadMessage.value = null
}

const showUploadMessage = (text, type) => {
  uploadMessage.value = { text, type }
  setTimeout(() => {
    uploadMessage.value = null
  }, 5000)
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

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
    
    // إعادة تحميل الإعدادات في جميع أنحاء الموقع
    await refreshSiteSettings()
    
    // إظهار رسالة النجاح
    alert('تم حفظ الإعدادات بنجاح')
    
  } catch (error) {
    console.error('خطأ في حفظ الإعدادات:', error)
    alert('حدث خطأ أثناء حفظ الإعدادات')
  } finally {
    saving.value = false
  }
}

// إعادة تحميل الإعدادات في جميع أنحاء الموقع
const refreshSiteSettings = async () => {
  try {
    // إعادة تحميل الإعدادات في الـ composable
    await loadSettingsFromComposable(true)
    
    // إرسال إشارة لتحديث الإعدادات في جميع المكونات
    if (process.client) {
      window.dispatchEvent(new CustomEvent('settings-updated'))
      
      // استخدام localStorage للتحديث عبر التبويبات
      localStorage.setItem('settings-updated', Date.now().toString())
      localStorage.removeItem('settings-updated')
    }
    
    // إرسال إشارة لتحديث الإعدادات في جميع المكونات
    await $fetch('/api/cms/site-settings/refresh', {
      method: 'POST'
    }).catch(() => {
      // تجاهل الخطأ إذا لم يكن الـ endpoint موجود
    })
  } catch (error) {
    console.error('خطأ في إعادة تحميل الإعدادات:', error)
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