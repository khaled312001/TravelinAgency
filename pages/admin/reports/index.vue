<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
        <p class="mt-1 text-sm text-gray-600">تحليل شامل لأداء الموقع والمبيعات</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <button
          @click="exportReport"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:download" class="h-5 w-5 ml-2" />
          تصدير التقرير
        </button>
        <button
          @click="refreshData"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Icon v-if="loading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
          <Icon v-else name="material-symbols:refresh" class="h-5 w-5 ml-2" />
          تحديث البيانات
        </button>
      </div>
    </div>

    <!-- فلاتر الفترة الزمنية -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2 space-x-reverse">
          <label class="text-sm font-medium text-gray-700">الفترة الزمنية:</label>
          <select
            v-model="selectedPeriod"
            @change="loadReportData"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
            <option value="custom">فترة مخصصة</option>
          </select>
        </div>
        
        <div v-if="selectedPeriod === 'custom'" class="flex items-center space-x-2 space-x-reverse">
          <input
            v-model="customStartDate"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span class="text-gray-500">إلى</span>
          <input
            v-model="customEndDate"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            @click="loadReportData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تطبيق
          </button>
        </div>
      </div>
    </div>

    <!-- إحصائيات عامة -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.totalRevenue) }}</p>
            <p class="text-sm text-green-600">{{ stats.revenueGrowth }}% من الفترة السابقة</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <Icon name="material-symbols:attach-money" class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">عدد الحجوزات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalBookings }}</p>
            <p class="text-sm text-blue-600">{{ stats.bookingsGrowth }}% من الفترة السابقة</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:book-online" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">متوسط قيمة الحجز</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.averageBookingValue) }}</p>
            <p class="text-sm text-purple-600">{{ stats.avgValueGrowth }}% من الفترة السابقة</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:trending-up" class="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">معدل التحويل</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.conversionRate }}%</p>
            <p class="text-sm text-orange-600">{{ stats.conversionGrowth }}% من الفترة السابقة</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <Icon name="material-symbols:percent" class="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- الرسوم البيانية -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- رسم المبيعات -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">اتجاه المبيعات</h3>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="text-sm text-gray-500">آخر 12 شهر</span>
            <Icon name="material-symbols:trending-up" class="h-5 w-5 text-green-600" />
          </div>
        </div>
        <LineChart 
          :data="revenueChartData" 
          :height="280"
          :options="revenueChartOptions"
        />
      </div>

      <!-- رسم الحجوزات -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">اتجاه الحجوزات</h3>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="text-sm text-gray-500">آخر 12 شهر</span>
            <Icon name="material-symbols:show-chart" class="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <BarChart 
          :data="bookingsChartData" 
          :height="280"
          :options="bookingsChartOptions"
        />
      </div>
    </div>

    <!-- رسوم بيانية إضافية -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- توزيع العملاء -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">توزيع العملاء</h3>
          <Icon name="material-symbols:pie-chart" class="h-5 w-5 text-purple-600" />
        </div>
        <PieChart 
          :data="customerDistributionData" 
          :height="250"
          :options="customerChartOptions"
        />
      </div>

      <!-- أفضل الوجهات -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">أفضل الوجهات</h3>
          <Icon name="material-symbols:location-on" class="h-5 w-5 text-green-600" />
        </div>
        <BarChart 
          :data="destinationsChartData" 
          :height="250"
          :options="destinationsChartOptions"
        />
      </div>

      <!-- أداء الفريق -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">أداء الفريق</h3>
          <Icon name="material-symbols:group" class="h-5 w-5 text-orange-600" />
        </div>
        <DoughnutChart 
          :data="teamPerformanceData" 
          :height="250"
          :options="teamChartOptions"
        />
      </div>
    </div>

    <!-- تقارير مفصلة -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- أفضل الباقات مبيعاً -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">أفضل الباقات مبيعاً</h3>
        <div class="space-y-4">
          <div v-for="(pkg, index) in topPackages" :key="pkg.id" class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ pkg.title }}</p>
                <p class="text-xs text-gray-500">{{ pkg.bookings }} حجز</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatPrice(pkg.revenue) }}</p>
              <p class="text-xs text-gray-500">{{ pkg.growth }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- إحصائيات العملاء -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إحصائيات العملاء</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">عملاء جدد</span>
            <span class="text-sm font-medium text-gray-900">{{ customerStats.newCustomers }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">عملاء متكررون</span>
            <span class="text-sm font-medium text-gray-900">{{ customerStats.repeatCustomers }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">معدل الاحتفاظ</span>
            <span class="text-sm font-medium text-gray-900">{{ customerStats.retentionRate }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">متوسط قيمة العميل</span>
            <span class="text-sm font-medium text-gray-900">{{ formatPrice(customerStats.avgCustomerValue) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- تقرير الأداء -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">تقرير الأداء الشامل</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المؤشر</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة الحالية</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفترة السابقة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التغيير</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاتجاه</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="metric in performanceMetrics" :key="metric.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ metric.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ metric.current }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ metric.previous }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="metric.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Icon 
                  :name="metric.change >= 0 ? 'material-symbols:trending-up' : 'material-symbols:trending-down'" 
                  :class="metric.change >= 0 ? 'text-green-600' : 'text-red-600'"
                  class="h-5 w-5"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LineChart, BarChart, PieChart, DoughnutChart } from '~/components/charts'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const loading = ref(false)
const selectedPeriod = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')

// البيانات
const stats = ref({
  totalRevenue: 0,
  revenueGrowth: 0,
  totalBookings: 0,
  bookingsGrowth: 0,
  averageBookingValue: 0,
  avgValueGrowth: 0,
  conversionRate: 0,
  conversionGrowth: 0
})

const topPackages = ref([])
const customerStats = ref({
  newCustomers: 0,
  repeatCustomers: 0,
  retentionRate: 0,
  avgCustomerValue: 0
})

const performanceMetrics = ref([])

// بيانات الرسوم البيانية
const revenueChartData = ref({
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  datasets: [{
    label: 'المبيعات (ريال)',
    data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 80000, 78000, 85000],
    borderColor: 'rgb(34, 197, 94)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    fill: true,
    tension: 0.4
  }]
})

const bookingsChartData = ref({
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  datasets: [{
    label: 'عدد الحجوزات',
    data: [12, 15, 18, 22, 20, 25, 28, 26, 30, 32, 29, 35],
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderColor: 'rgb(59, 130, 246)',
    borderWidth: 1
  }]
})

const customerDistributionData = ref({
  labels: ['عملاء جدد', 'عملاء متكررون', 'عملاء VIP', 'عملاء محتملون'],
  datasets: [{
    data: [45, 30, 15, 10],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)'
    ]
  }]
})

const destinationsChartData = ref({
  labels: ['دبي', 'تركيا', 'ماليزيا', 'تايلاند', 'مصر', 'المغرب'],
  datasets: [{
    label: 'عدد الحجوزات',
    data: [25, 20, 18, 15, 12, 10],
    backgroundColor: [
      'rgba(16, 185, 129, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)'
    ],
    borderColor: [
      'rgb(16, 185, 129)',
      'rgb(59, 130, 246)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)',
      'rgb(236, 72, 153)'
    ],
    borderWidth: 1
  }]
})

const teamPerformanceData = ref({
  labels: ['أحمد محمد', 'فاطمة علي', 'محمد أحمد', 'نورا سعد', 'خالد حسن'],
  datasets: [{
    data: [25, 20, 18, 15, 12],
    backgroundColor: [
      'rgba(34, 197, 94, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)'
    ],
    borderColor: [
      'rgb(34, 197, 94)',
      'rgb(59, 130, 246)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)'
    ]
  }]
})

// إعدادات الرسوم البيانية
const revenueChartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('ar-SA').format(value) + ' ريال'
        }
      }
    }
  }
})

const bookingsChartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5
      }
    }
  }
})

const customerChartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    }
  }
})

const destinationsChartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5
      }
    }
  }
})

const teamChartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 10,
        usePointStyle: true,
        font: {
          size: 10
        }
      }
    }
  }
})

// تحميل بيانات التقرير
const loadReportData = async () => {
  try {
    loading.value = true
    
    // TODO: Add API endpoint for reports
    // For now, use mock data
    stats.value = {
      totalRevenue: 125000,
      revenueGrowth: 15.2,
      totalBookings: 45,
      bookingsGrowth: 8.5,
      averageBookingValue: 2777,
      avgValueGrowth: 6.3,
      conversionRate: 3.2,
      conversionGrowth: 1.1
    }

    topPackages.value = [
      { id: 1, title: 'رحلة إلى دبي', bookings: 12, revenue: 30000, growth: 25 },
      { id: 2, title: 'عمرة رمضان', bookings: 8, revenue: 14400, growth: 18 },
      { id: 3, title: 'رحلة إلى تركيا', bookings: 6, revenue: 18000, growth: 12 }
    ]

    customerStats.value = {
      newCustomers: 28,
      repeatCustomers: 17,
      retentionRate: 68,
      avgCustomerValue: 3125
    }

    performanceMetrics.value = [
      { name: 'إجمالي المبيعات', current: '125,000 ريال', previous: '108,500 ريال', change: 15.2 },
      { name: 'عدد الحجوزات', current: '45', previous: '41', change: 8.5 },
      { name: 'متوسط قيمة الحجز', current: '2,777 ريال', previous: '2,646 ريال', change: 6.3 },
      { name: 'معدل التحويل', current: '3.2%', previous: '3.1%', change: 1.1 },
      { name: 'عملاء جدد', current: '28', previous: '25', change: 12.0 },
      { name: 'معدل الاحتفاظ', current: '68%', previous: '65%', change: 4.6 }
    ]

  } catch (error) {
    console.error('خطأ في تحميل بيانات التقرير:', error)
  } finally {
    loading.value = false
  }
}

// تحديث البيانات
const refreshData = () => {
  loadReportData()
}

// تصدير التقرير
const exportReport = () => {
  // TODO: Implement report export functionality
  console.log('Exporting report...')
}

// دوال المساعدة
const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadReportData()
})

// SEO والميتا
useHead({
  title: 'التقارير والإحصائيات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'تحليل شامل لأداء الموقع والمبيعات' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
