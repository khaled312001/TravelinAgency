<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة SEO</h1>
        <p class="mt-1 text-sm text-gray-600">تحسين محركات البحث وإدارة الميتا تاغز</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="generateSitemap"
          :disabled="generatingSitemap"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Icon name="material-symbols:refresh" class="h-5 w-5 ml-2" :class="{ 'animate-spin': generatingSitemap }" />
          {{ generatingSitemap ? 'جاري التحديث...' : 'تحديث خريطة الموقع' }}
        </button>
      </div>
    </div>

    <!-- إحصائيات SEO -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:search" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">الصفحات المفهرسة</p>
            <p class="text-2xl font-bold text-gray-900">{{ seoStats.indexedPages }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="material-symbols:trending-up" class="h-6 w-6 text-green-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">معدل الأداء</p>
            <p class="text-2xl font-bold text-gray-900">{{ seoStats.performanceScore }}%</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <Icon name="material-symbols:warning" class="h-6 w-6 text-orange-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">مشاكل SEO</p>
            <p class="text-2xl font-bold text-gray-900">{{ seoStats.seoIssues }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:link" class="h-6 w-6 text-purple-600" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600">الروابط الداخلية</p>
            <p class="text-2xl font-bold text-gray-900">{{ seoStats.internalLinks }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- تبويبات الصفحة -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 space-x-reverse px-6">
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

      <!-- محتوى التبويبات -->
      <div class="p-6">
        <!-- تبويب الميتا تاغز العامة -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- الميتا تاغز الأساسية -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">الميتا تاغز الأساسية</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الموقع (العربية)</label>
                <input
                  v-model="seoData.siteTitleAr"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان الموقع باللغة العربية"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الموقع (الإنجليزية)</label>
                <input
                  v-model="seoData.siteTitleEn"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Site Title in English"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">وصف الموقع (العربية)</label>
                <textarea
                  v-model="seoData.siteDescriptionAr"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف الموقع باللغة العربية"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">وصف الموقع (الإنجليزية)</label>
                <textarea
                  v-model="seoData.siteDescriptionEn"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Site description in English"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
                <input
                  v-model="seoData.keywords"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="سفر، سياحة، حجوزات، رحلات"
                />
                <p class="text-xs text-gray-500 mt-1">افصل الكلمات بفواصل</p>
              </div>
            </div>

            <!-- إعدادات إضافية -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">إعدادات إضافية</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">رابط الموقع</label>
                <input
                  v-model="seoData.siteUrl"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">صورة الموقع (Open Graph)</label>
                <input
                  v-model="seoData.ogImage"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">حساب Twitter</label>
                <input
                  v-model="seoData.twitterHandle"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">كود Google Analytics</label>
                <input
                  v-model="seoData.googleAnalytics"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">كود Google Search Console</label>
                <input
                  v-model="seoData.googleSearchConsole"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="google-site-verification=..."
                />
              </div>
            </div>
          </div>

          <!-- معاينة الميتا تاغز -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 mb-3">معاينة الميتا تاغز</h4>
            <div class="bg-white rounded border p-4">
              <div class="text-blue-600 text-lg font-medium mb-1">{{ seoData.siteTitleAr || 'عنوان الموقع' }}</div>
              <div class="text-green-600 text-sm mb-2">{{ seoData.siteUrl || 'https://example.com' }}</div>
              <div class="text-gray-600 text-sm">{{ seoData.siteDescriptionAr || 'وصف الموقع' }}</div>
            </div>
          </div>
        </div>

        <!-- تبويب صفحات الموقع -->
        <div v-if="activeTab === 'pages'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">إدارة SEO للصفحات</h3>
            <button
              @click="addNewPage"
              class="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="material-symbols:add" class="h-4 w-4 ml-2" />
              إضافة صفحة
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصفحة</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="page in seoPages" :key="page.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <Icon name="material-symbols:article" class="h-5 w-5 text-gray-400 ml-2" />
                      <span class="text-sm font-medium text-gray-900">{{ page.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ page.title || 'غير محدد' }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-500">{{ page.description || 'غير محدد' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getSeoStatusColor(page.seoStatus)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getSeoStatusName(page.seoStatus) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editPageSeo(page)"
                      class="text-blue-600 hover:text-blue-900 ml-3"
                    >
                      <Icon name="material-symbols:edit" class="h-4 w-4" />
                    </button>
                    <button
                      @click="deletePageSeo(page)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <Icon name="material-symbols:delete" class="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- تبويب خريطة الموقع -->
        <div v-if="activeTab === 'sitemap'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">إعدادات خريطة الموقع</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تحديث تلقائي</label>
                  <div class="flex items-center">
                    <input
                      v-model="sitemapSettings.autoUpdate"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="mr-2 text-sm text-gray-700">تفعيل التحديث التلقائي</label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تكرار التحديث</label>
                  <select
                    v-model="sitemapSettings.updateFrequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">أولوية الصفحات</label>
                  <select
                    v-model="sitemapSettings.priority"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1.0">عالية (1.0)</option>
                    <option value="0.8">متوسطة (0.8)</option>
                    <option value="0.6">منخفضة (0.6)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">معلومات خريطة الموقع</h3>
              
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">آخر تحديث:</span>
                  <span class="text-sm font-medium">{{ sitemapInfo.lastUpdate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">عدد الصفحات:</span>
                  <span class="text-sm font-medium">{{ sitemapInfo.totalPages }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">حجم الملف:</span>
                  <span class="text-sm font-medium">{{ sitemapInfo.fileSize }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">رابط خريطة الموقع:</span>
                  <a :href="sitemapInfo.url" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">
                    عرض الخريطة
                  </a>
                </div>
              </div>

              <div class="mt-4">
                <button
                  @click="downloadSitemap"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Icon name="material-symbols:download" class="h-4 w-4 ml-2" />
                  تحميل خريطة الموقع
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- تبويب التحليلات -->
        <div v-if="activeTab === 'analytics'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">إعدادات Google Analytics</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">معرف التتبع</label>
                  <input
                    v-model="analyticsSettings.trackingId"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تتبع الأحداث</label>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input
                        v-model="analyticsSettings.trackPageViews"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="mr-2 text-sm text-gray-700">تتبع مشاهدات الصفحات</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        v-model="analyticsSettings.trackClicks"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="mr-2 text-sm text-gray-700">تتبع النقرات</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        v-model="analyticsSettings.trackForms"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="mr-2 text-sm text-gray-700">تتبع النماذج</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">إحصائيات الأداء</h3>
              
              <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-blue-900">معدل الارتداد</span>
                    <span class="text-lg font-bold text-blue-600">{{ performanceStats.bounceRate }}%</span>
                  </div>
                </div>

                <div class="bg-green-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-green-900">متوسط مدة الجلسة</span>
                    <span class="text-lg font-bold text-green-600">{{ performanceStats.avgSessionDuration }}</span>
                  </div>
                </div>

                <div class="bg-purple-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-purple-900">صفحات لكل جلسة</span>
                    <span class="text-lg font-bold text-purple-600">{{ performanceStats.pagesPerSession }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- أزرار الحفظ -->
    <div class="flex justify-end space-x-3 space-x-reverse">
      <button
        @click="resetForm"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        إعادة تعيين
      </button>
      <button
        @click="saveSeoSettings"
        :disabled="saving"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <Icon name="material-symbols:save" class="h-4 w-4 ml-2" :class="{ 'animate-spin': saving }" />
        {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
      </button>
    </div>

    <!-- نافذة تحرير SEO للصفحة -->
    <div
      v-if="showPageSeoModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closePageSeoModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">تحرير SEO للصفحة</h3>
            <button @click="closePageSeoModal" class="text-gray-400 hover:text-gray-600">
              <Icon name="material-symbols:close" class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الصفحة</label>
              <input
                v-model="editingPage.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وصف الصفحة</label>
              <textarea
                v-model="editingPage.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
              <input
                v-model="editingPage.keywords"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">صورة Open Graph</label>
              <input
                v-model="editingPage.ogImage"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 space-x-reverse mt-6">
            <button
              @click="closePageSeoModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              @click="savePageSeo"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              حفظ
            </button>
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
const activeTab = ref('general')
const saving = ref(false)
const generatingSitemap = ref(false)
const showPageSeoModal = ref(false)
const editingPage = ref({})

// بيانات SEO
const seoData = ref({
  siteTitleAr: 'Wonder Land - وكالة السفر الرائدة',
  siteTitleEn: 'Wonder Land - Leading Travel Agency',
  siteDescriptionAr: 'اكتشف أجمل الوجهات السياحية مع Wonder Land. نقدم أفضل عروض السفر والحجوزات في المملكة العربية السعودية.',
  siteDescriptionEn: 'Discover the most beautiful tourist destinations with Wonder Land. We offer the best travel deals and bookings in Saudi Arabia.',
  keywords: 'سفر، سياحة، حجوزات، رحلات، السعودية، وجهات سياحية',
  siteUrl: 'https://wonderland.com',
  ogImage: '',
  twitterHandle: '@wonderland',
  googleAnalytics: '',
  googleSearchConsole: ''
})

// إحصائيات SEO
const seoStats = ref({
  indexedPages: 45,
  performanceScore: 87,
  seoIssues: 3,
  internalLinks: 128
})

// صفحات SEO
const seoPages = ref([
  {
    id: 1,
    name: 'الصفحة الرئيسية',
    title: 'Wonder Land - وكالة السفر الرائدة',
    description: 'اكتشف أجمل الوجهات السياحية مع Wonder Land',
    seoStatus: 'optimized'
  },
  {
    id: 2,
    name: 'من نحن',
    title: 'من نحن - Wonder Land',
    description: 'تعرف على قصة Wonder Land وخدماتنا المتميزة',
    seoStatus: 'needs-work'
  },
  {
    id: 3,
    name: 'الحزم السياحية',
    title: 'الحزم السياحية - Wonder Land',
    description: 'استكشف أفضل الباقات السياحية والعروض',
    seoStatus: 'optimized'
  }
])

// إعدادات خريطة الموقع
const sitemapSettings = ref({
  autoUpdate: true,
  updateFrequency: 'weekly',
  priority: '1.0'
})

// معلومات خريطة الموقع
const sitemapInfo = ref({
  lastUpdate: '2024-01-15 10:30',
  totalPages: 45,
  fileSize: '2.3 KB',
  url: '/sitemap.xml'
})

// إعدادات التحليلات
const analyticsSettings = ref({
  trackingId: '',
  trackPageViews: true,
  trackClicks: true,
  trackForms: true
})

// إحصائيات الأداء
const performanceStats = ref({
  bounceRate: 35,
  avgSessionDuration: '2:45',
  pagesPerSession: 3.2
})

// التبويبات
const tabs = [
  { id: 'general', name: 'الميتا تاغز العامة', icon: 'material-symbols:settings' },
  { id: 'pages', name: 'صفحات الموقع', icon: 'material-symbols:article' },
  { id: 'sitemap', name: 'خريطة الموقع', icon: 'material-symbols:map' },
  { id: 'analytics', name: 'التحليلات', icon: 'material-symbols:analytics' }
]

// دوال المساعدة
const getSeoStatusName = (status) => {
  const statuses = {
    optimized: 'محسن',
    'needs-work': 'يحتاج تحسين',
    'not-optimized': 'غير محسن'
  }
  return statuses[status] || status
}

const getSeoStatusColor = (status) => {
  const colors = {
    optimized: 'bg-green-100 text-green-800',
    'needs-work': 'bg-orange-100 text-orange-800',
    'not-optimized': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// دوال الإجراءات
const saveSeoSettings = async () => {
  try {
    saving.value = true
    const response = await $fetch('/api/seo', {
      method: 'PUT',
      body: {
        seoData: seoData.value,
        sitemapSettings: sitemapSettings.value,
        analyticsSettings: analyticsSettings.value
      }
    })
    
    if (response.success) {
      console.log('تم حفظ إعدادات SEO بنجاح')
      // Show success notification
    }
  } catch (error) {
    console.error('خطأ في حفظ إعدادات SEO:', error)
  } finally {
    saving.value = false
  }
}

const generateSitemap = async () => {
  try {
    generatingSitemap.value = true
    const response = await $fetch('/api/seo/sitemap/generate', {
      method: 'POST',
      body: sitemapSettings.value
    })
    
    if (response.success) {
      sitemapInfo.value = { ...sitemapInfo.value, ...response.data }
      console.log('تم تحديث خريطة الموقع بنجاح')
    }
  } catch (error) {
    console.error('خطأ في تحديث خريطة الموقع:', error)
  } finally {
    generatingSitemap.value = false
  }
}

const downloadSitemap = () => {
  // TODO: Implement sitemap download
  console.log('تحميل خريطة الموقع')
}

const addNewPage = () => {
  editingPage.value = {
    name: '',
    title: '',
    description: '',
    keywords: '',
    ogImage: ''
  }
  showPageSeoModal.value = true
}

const editPageSeo = (page) => {
  editingPage.value = { ...page }
  showPageSeoModal.value = true
}

const deletePageSeo = async (page) => {
  if (confirm('هل أنت متأكد من حذف إعدادات SEO لهذه الصفحة؟')) {
    try {
      const response = await $fetch(`/api/seo/pages/${page.id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        const index = seoPages.value.findIndex(p => p.id === page.id)
        if (index !== -1) {
          seoPages.value.splice(index, 1)
        }
      }
    } catch (error) {
      console.error('خطأ في حذف صفحة SEO:', error)
    }
  }
}

const savePageSeo = async () => {
  try {
    if (editingPage.value.id) {
      // Update existing page
      const response = await $fetch(`/api/seo/pages/${editingPage.value.id}`, {
        method: 'PUT',
        body: editingPage.value
      })
      
      if (response.success) {
        const index = seoPages.value.findIndex(p => p.id === editingPage.value.id)
        if (index !== -1) {
          seoPages.value[index] = { ...editingPage.value, ...response.data }
        }
      }
    } else {
      // Add new page
      const response = await $fetch('/api/seo/pages', {
        method: 'POST',
        body: editingPage.value
      })
      
      if (response.success) {
        seoPages.value.push(response.data)
      }
    }
    closePageSeoModal()
  } catch (error) {
    console.error('خطأ في حفظ صفحة SEO:', error)
  }
}

const closePageSeoModal = () => {
  showPageSeoModal.value = false
  editingPage.value = {}
}

const resetForm = () => {
  if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
    // Reset to default values
    seoData.value = {
      siteTitleAr: '',
      siteTitleEn: '',
      siteDescriptionAr: '',
      siteDescriptionEn: '',
      keywords: '',
      siteUrl: '',
      ogImage: '',
      twitterHandle: '',
      googleAnalytics: '',
      googleSearchConsole: ''
    }
  }
}

// تحميل البيانات عند تحميل الصفحة
const loadSeoData = async () => {
  try {
    const response = await $fetch('/api/seo')
    if (response.success) {
      const { seoData: apiSeoData, seoStats: apiSeoStats, seoPages: apiSeoPages, sitemapSettings: apiSitemapSettings, sitemapInfo: apiSitemapInfo, analyticsSettings: apiAnalyticsSettings, performanceStats: apiPerformanceStats } = response.data
      
      seoData.value = { ...seoData.value, ...apiSeoData }
      seoStats.value = { ...seoStats.value, ...apiSeoStats }
      seoPages.value = apiSeoPages
      sitemapSettings.value = { ...sitemapSettings.value, ...apiSitemapSettings }
      sitemapInfo.value = { ...sitemapInfo.value, ...apiSitemapInfo }
      analyticsSettings.value = { ...analyticsSettings.value, ...apiAnalyticsSettings }
      performanceStats.value = { ...performanceStats.value, ...apiPerformanceStats }
    }
  } catch (error) {
    console.error('خطأ في تحميل بيانات SEO:', error)
  }
}

onMounted(() => {
  loadSeoData()
})

// SEO والميتا
useHead({
  title: 'إدارة SEO - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إدارة وتحسين محركات البحث للموقع' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
