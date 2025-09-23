<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
        <p class="text-gray-600">إدارة إعدادات الموقع العامة</p>
      </div>
      <button
        @click="saveSettings"
        :disabled="saving"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
      >
        <Icon v-if="saving" name="material-symbols:refresh" class="h-5 w-5 ml-2 animate-spin" />
        <Icon v-else name="material-symbols:save" class="h-5 w-5 ml-2" />
        {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 space-x-reverse px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
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
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اسم الموقع</label>
              <input
                v-model="settings.general.site_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شعار الموقع</label>
              <input
                v-model="settings.general.site_tagline"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شعار الموقع (URL)</label>
            <input
              v-model="settings.general.site_logo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Contact Settings -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                v-model="settings.contact.contact_email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                v-model="settings.contact.contact_phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <textarea
              v-model="settings.contact.contact_address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Social Media Settings -->
        <div v-if="activeTab === 'social'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">فيسبوك</label>
              <input
                v-model="settings.social.social_facebook"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تويتر</label>
              <input
                v-model="settings.social.social_twitter"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">إنستغرام</label>
              <input
                v-model="settings.social.social_instagram"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لينكد إن</label>
              <input
                v-model="settings.social.social_linkedin"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- SEO Settings -->
        <div v-if="activeTab === 'seo'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية افتراضية</label>
            <input
              v-model="settings.seo.default_keywords"
              type="text"
              placeholder="سفر، سياحة، رحلات، السعودية"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف افتراضي</label>
            <textarea
              v-model="settings.seo.default_description"
              rows="3"
              placeholder="وصف الموقع الافتراضي"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كود Google Analytics</label>
            <input
              v-model="settings.seo.google_analytics"
              type="text"
              placeholder="G-XXXXXXXXXX"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
const activeTab = ref('general')
const saving = ref(false)
const settings = ref({
  general: {
    site_name: '',
    site_tagline: '',
    site_logo: ''
  },
  contact: {
    contact_email: '',
    contact_phone: '',
    contact_address: ''
  },
  social: {
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: ''
  },
  seo: {
    default_keywords: '',
    default_description: '',
    google_analytics: ''
  }
})

const tabs = [
  { id: 'general', name: 'عام', icon: 'material-symbols:settings' },
  { id: 'contact', name: 'التواصل', icon: 'material-symbols:contact-phone' },
  { id: 'social', name: 'وسائل التواصل', icon: 'material-symbols:share' },
  { id: 'seo', name: 'SEO', icon: 'material-symbols:search' }
]

// Methods
const loadSettings = async () => {
  try {
    const response = await $fetch('/api/cms/site-settings')
    const flatSettings = response.data.flat
    
    // Group settings by category
    const groupedSettings = {
      general: {},
      contact: {},
      social: {},
      seo: {}
    }
    
    flatSettings.forEach(setting => {
      if (groupedSettings[setting.category]) {
        groupedSettings[setting.category][setting.setting_key] = setting.setting_value || ''
      }
    })
    
    settings.value = groupedSettings
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

const saveSettings = async () => {
  try {
    saving.value = true
    
    // Flatten settings for API
    const flatSettings = []
    
    Object.keys(settings.value).forEach(category => {
      Object.keys(settings.value[category]).forEach(key => {
        flatSettings.push({
          setting_key: key,
          setting_value: settings.value[category][key],
          category: category,
          setting_type: 'text',
          is_public: true
        })
      })
    })
    
    await $fetch('/api/cms/site-settings', {
      method: 'PUT',
      body: { settings: flatSettings }
    })
    
    // Show success message
    alert('تم حفظ الإعدادات بنجاح')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('حدث خطأ أثناء حفظ الإعدادات')
  } finally {
    saving.value = false
  }
}

// Load settings on mount
onMounted(() => {
  loadSettings()
})
</script>
