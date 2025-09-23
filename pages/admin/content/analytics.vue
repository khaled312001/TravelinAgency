<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إحصائيات المحتوى</h1>
        <p class="mt-1 text-sm text-gray-600">تحليل شامل لأداء المحتوى والزوار</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/content"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- فلاتر التاريخ -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2 space-x-reverse">
          <label class="text-sm font-medium text-gray-700">من:</label>
          <input
            v-model="dateFrom"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="flex items-center space-x-2 space-x-reverse">
          <label class="text-sm font-medium text-gray-700">إلى:</label>
          <input
            v-model="dateTo"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          تطبيق
        </button>
      </div>
    </div>

    <!-- الإحصائيات الرئيسية -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:visibility" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalViews.toLocaleString() }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <Icon name="material-symbols:trending-up" class="h-4 w-4 text-green-600 ml-1" />
          <span class="text-sm text-green-600 font-medium">+12.5%</span>
          <span class="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <Icon name="material-symbols:article" class="h-6 w-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">الصفحات المنشورة</p>
            <p class="text-2xl font-bold text-gray-900">{{ publishedPages }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <Icon name="material-symbols:trending-up" class="h-4 w-4 text-green-600 ml-1" />
          <span class="text-sm text-green-600 font-medium">+3</span>
          <span class="text-sm text-gray-500 mr-2">هذا الشهر</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:schedule" class="h-6 w-6 text-purple-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">متوسط وقت القراءة</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageReadTime }} دقيقة</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <Icon name="material-symbols:trending-up" class="h-4 w-4 text-green-600 ml-1" />
          <span class="text-sm text-green-600 font-medium">+0.5</span>
          <span class="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 rounded-lg">
            <Icon name="material-symbols:share" class="h-6 w-6 text-orange-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">معدل المشاركة</p>
            <p class="text-2xl font-bold text-gray-900">{{ shareRate }}%</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <Icon name="material-symbols:trending-down" class="h-4 w-4 text-red-600 ml-1" />
          <span class="text-sm text-red-600 font-medium">-2.1%</span>
          <span class="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
        </div>
      </div>
    </div>

    <!-- الرسوم البيانية -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- رسم بياني للمشاهدات -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">المشاهدات الشهرية</h3>
        <div class="h-64">
          <LineChart :data="viewsData" :options="chartOptions" />
        </div>
      </div>

      <!-- رسم بياني لأنواع المحتوى -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">توزيع أنواع المحتوى</h3>
        <div class="h-64">
          <DoughnutChart :data="contentTypeData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- الصفحات الأكثر مشاهدة -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">الصفحات الأكثر مشاهدة</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصفحة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المشاهدات
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                معدل الارتداد
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وقت المتوسط
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="page in topPages" :key="page.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                      <Icon name="material-symbols:article" class="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">{{ page.title }}</div>
                    <div class="text-sm text-gray-500">{{ page.type }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ page.views.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ page.bounceRate }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ page.avgTime }} دقيقة
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- إحصائيات الأجهزة -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">الأجهزة</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:phone-android" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">الهواتف</span>
            </div>
            <span class="text-sm font-medium text-gray-900">65%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:computer" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">أجهزة الكمبيوتر</span>
            </div>
            <span class="text-sm font-medium text-gray-900">25%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:tablet" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">الأجهزة اللوحية</span>
            </div>
            <span class="text-sm font-medium text-gray-900">10%</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">المتصفحات</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:chrome" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">Chrome</span>
            </div>
            <span class="text-sm font-medium text-gray-900">45%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:safari" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">Safari</span>
            </div>
            <span class="text-sm font-medium text-gray-900">30%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:firefox" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">Firefox</span>
            </div>
            <span class="text-sm font-medium text-gray-900">15%</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">المصادر</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:search" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">البحث</span>
            </div>
            <span class="text-sm font-medium text-gray-900">40%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:share" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">المشاركة</span>
            </div>
            <span class="text-sm font-medium text-gray-900">35%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="material-symbols:link" class="h-5 w-5 text-gray-600 ml-2" />
              <span class="text-sm text-gray-700">مباشر</span>
            </div>
            <span class="text-sm font-medium text-gray-900">25%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LineChart, DoughnutChart } from '~/components/charts'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const dateFrom = ref('')
const dateTo = ref('')

// البيانات الوهمية
const totalViews = ref(125430)
const publishedPages = ref(24)
const averageReadTime = ref(3.2)
const shareRate = ref(12.5)

// بيانات الرسوم البيانية
const viewsData = ref({
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
  datasets: [{
    label: 'المشاهدات',
    data: [12000, 15000, 18000, 22000, 25000, 28000],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4
  }]
})

const contentTypeData = ref({
  labels: ['صفحات', 'مقالات', 'أخبار'],
  datasets: [{
    data: [45, 35, 20],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)'
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)'
    ]
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

// الصفحات الأكثر مشاهدة
const topPages = ref([
  {
    id: 1,
    title: 'من نحن',
    type: 'صفحة',
    views: 15420,
    bounceRate: 35,
    avgTime: 2.5
  },
  {
    id: 2,
    title: 'خدماتنا',
    type: 'صفحة',
    views: 12350,
    bounceRate: 42,
    avgTime: 3.1
  },
  {
    id: 3,
    title: 'أخبار السفر',
    type: 'مقال',
    views: 9870,
    bounceRate: 28,
    avgTime: 4.2
  },
  {
    id: 4,
    title: 'اتصل بنا',
    type: 'صفحة',
    views: 8760,
    bounceRate: 55,
    avgTime: 1.8
  }
])

// دوال الإجراءات
const applyFilters = () => {
  // TODO: تطبيق الفلاتر على البيانات
  console.log('Applying filters:', { dateFrom: dateFrom.value, dateTo: dateTo.value })
}

// تهيئة التواريخ
onMounted(() => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  dateTo.value = today.toISOString().split('T')[0]
  dateFrom.value = lastMonth.toISOString().split('T')[0]
})

// SEO والميتا
useHead({
  title: 'إحصائيات المحتوى - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'تحليل شامل لأداء المحتوى والزوار' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>