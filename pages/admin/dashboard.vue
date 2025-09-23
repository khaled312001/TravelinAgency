<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- ترحيب -->
    <div class="bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl p-6 text-white shadow-sm">
      <h1 class="text-2xl font-semibold mb-2">مرحباً بك في لوحة التحكم</h1>
      <p class="text-slate-200">إدارة شاملة لموقع Wonder Land Traveling Agency</p>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <!-- إجمالي الباقات -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-slate-100 rounded-lg">
            <Icon name="material-symbols:package-2" class="h-6 w-6 text-slate-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-slate-600">إجمالي الحزم</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totalPackages }}</p>
          </div>
        </div>
      </div>

      <!-- إجمالي الوجهات -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-slate-100 rounded-lg">
            <Icon name="material-symbols:location-on" class="h-6 w-6 text-slate-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-slate-600">إجمالي الوجهات</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totalDestinations }}</p>
          </div>
        </div>
      </div>

      <!-- الرسائل الجديدة -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-slate-100 rounded-lg">
            <Icon name="material-symbols:mail" class="h-6 w-6 text-slate-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-slate-600">رسائل جديدة</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.newMessages }}</p>
          </div>
        </div>
      </div>

      <!-- المستخدمين المسجلين -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-slate-100 rounded-lg">
            <Icon name="material-symbols:group" class="h-6 w-6 text-slate-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-slate-600">المستخدمين</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <!-- إجمالي الحجوزات -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-slate-100 rounded-lg">
            <Icon name="material-symbols:book-online" class="h-6 w-6 text-slate-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-slate-600">إجمالي الحجوزات</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totalBookings }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- الرسوم البيانية والإحصائيات -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- رسم بياني للمبيعات الشهرية -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">المبيعات الشهرية</h2>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="text-sm text-slate-500">آخر 6 أشهر</span>
            <Icon name="material-symbols:trending-up" class="h-5 w-5 text-slate-600" />
          </div>
        </div>
        <LineChart 
          :data="monthlySalesData" 
          :height="250"
          :options="salesChartOptions"
        />
      </div>

      <!-- رسم بياني لتوزيع الحجوزات -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">توزيع الحجوزات</h2>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="text-sm text-slate-500">حسب النوع</span>
            <Icon name="material-symbols:pie-chart" class="h-5 w-5 text-slate-600" />
          </div>
        </div>
        <DoughnutChart 
          :data="bookingsDistributionData" 
          :height="250"
          :options="distributionChartOptions"
        />
      </div>
    </div>

    <!-- الأنشطة الحديثة والإحصائيات -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- الأنشطة الحديثة -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="p-6 border-b border-slate-200/60">
          <h2 class="text-lg font-semibold text-slate-800">الأنشطة الحديثة</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 space-x-reverse">
              <div :class="[
                'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                activity.type === 'package' ? 'bg-slate-500' :
                activity.type === 'message' ? 'bg-slate-400' :
                activity.type === 'user' ? 'bg-slate-600' : 'bg-slate-300'
              ]"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-800">{{ activity.title }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ formatDate(activity.created_at) }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="loadingActivities" class="flex justify-center py-4">
            <Icon name="material-symbols:progress-activity" class="animate-spin h-6 w-6 text-slate-400" />
          </div>
          
          <div v-if="recentActivities.length === 0 && !loadingActivities" class="text-center py-8">
            <Icon name="material-symbols:inbox" class="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p class="text-slate-500">لا توجد أنشطة حديثة</p>
          </div>
        </div>
      </div>

      <!-- الباقات الأكثر شعبية -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        <div class="p-6 border-b border-slate-200/60">
          <h2 class="text-lg font-semibold text-slate-800">الباقات الأكثر شعبية</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="pkg in popularPackages" :key="pkg.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3 space-x-reverse">
                <img 
                  :src="pkg.image" 
                  :alt="pkg.title"
                  class="w-10 h-10 rounded-lg object-cover"
                  loading="lazy"
                />
                <div>
                  <p class="text-sm font-medium text-slate-800">{{ pkg.title }}</p>
                  <p class="text-xs text-slate-500">{{ pkg.views }} مشاهدة</p>
                </div>
              </div>
              <span class="text-sm font-medium text-slate-600">{{ formatPrice(pkg.price) }}</span>
            </div>
          </div>

          <div v-if="loadingPackages" class="flex justify-center py-4">
            <Icon name="material-symbols:progress-activity" class="animate-spin h-6 w-6 text-slate-400" />
          </div>

          <div v-if="popularPackages.length === 0 && !loadingPackages" class="text-center py-8">
            <Icon name="material-symbols:package-2-outline" class="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p class="text-slate-500">لا توجد حزم متاحة</p>
          </div>
        </div>
      </div>

      <!-- إحصائيات SEO -->
      <AdminSEODashboard />
    </div>

    <!-- الروابط السريعة -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all duration-200">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">الروابط السريعة</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          to="/admin/packages/create"
          class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
        >
          <Icon name="material-symbols:add-box" class="h-8 w-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-slate-700">إضافة حزمة</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/destinations/create"
          class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
        >
          <Icon name="material-symbols:add-location" class="h-8 w-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-slate-700">إضافة وجهة</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/contacts"
          class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
        >
          <Icon name="material-symbols:mail-outline" class="h-8 w-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-slate-700">عرض الرسائل</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/seo"
          class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
        >
          <Icon name="material-symbols:search" class="h-8 w-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-slate-700">إدارة SEO</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/settings"
          class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
        >
          <Icon name="material-symbols:settings" class="h-8 w-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-slate-700">الإعدادات</span>
        </NuxtLink>
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
const stats = ref({
  totalPackages: 0,
  totalDestinations: 0,
  newMessages: 0,
  totalUsers: 0,
  totalBookings: 0
})

const recentActivities = ref([])
const popularPackages = ref([])
const loadingActivities = ref(true)
const loadingPackages = ref(true)

// بيانات الرسوم البيانية
const monthlySalesData = ref({
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
  datasets: [{
    label: 'المبيعات (ريال)',
    data: [45000, 52000, 48000, 61000, 55000, 67000],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    fill: true,
    tension: 0.4
  }]
})

const bookingsDistributionData = ref({
  labels: ['رحلات داخلية', 'رحلات خارجية', 'عمرة', 'حج', 'رحلات ترفيهية'],
  datasets: [{
    data: [35, 25, 20, 15, 5],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)'
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)'
    ]
  }]
})

// إعدادات الرسوم البيانية
const salesChartOptions = ref({
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

const distributionChartOptions = ref({
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

// تحميل الإحصائيات
const loadStats = async () => {
  try {
    const result = await $fetch('/api/admin/stats')
    
    if (result && result.success && result.data) {
      stats.value = result.data.stats || {
        totalPackages: 0,
        totalDestinations: 0,
        newMessages: 0,
        totalUsers: 0,
        totalBookings: 0
      }
      recentActivities.value = Array.isArray(result.data.recentActivities) ? result.data.recentActivities : []
      popularPackages.value = Array.isArray(result.data.popularPackages) ? result.data.popularPackages : []
    } else {
      // Fallback values if API doesn't return expected structure
      stats.value = {
        totalPackages: 0,
        totalDestinations: 0,
        newMessages: 0,
        totalUsers: 0,
        totalBookings: 0
      }
      recentActivities.value = []
      popularPackages.value = []
    }
  } catch (error) {
    console.error('خطأ في تحميل الإحصائيات:', error)
    // استخدام قيم افتراضية في حالة الخطأ
    stats.value = {
      totalPackages: 0,
      totalDestinations: 0,
      newMessages: 0,
      totalUsers: 0,
      totalBookings: 0
    }
    recentActivities.value = []
    popularPackages.value = []
  } finally {
    loadingActivities.value = false
    loadingPackages.value = false
  }
}

// تحميل الأنشطة الحديثة
const loadRecentActivities = async () => {
  try {
    loadingActivities.value = true
    
    // الأنشطة يتم تحميلها الآن من API الإحصائيات
    // لا حاجة لاستدعاء منفصل
  } catch (error) {
    console.error('خطأ في تحميل الأنشطة:', error)
    recentActivities.value = []
  } finally {
    loadingActivities.value = false
  }
}

// تحميل الباقات الأكثر شعبية
const loadPopularPackages = async () => {
  try {
    loadingPackages.value = true
    
    // الباقات الشعبية يتم تحميلها الآن من API الإحصائيات
    // لا حاجة لاستدعاء منفصل
  } catch (error) {
    console.error('خطأ في تحميل الباقات الشعبية:', error)
    popularPackages.value = []
  } finally {
    loadingPackages.value = false
  }
}

// دوال المساعدة
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

// تحميل البيانات عند تحميل الصفحة
onMounted(async () => {
  // التأكد من أن المستخدم مصادق عليه قبل تحميل البيانات
  const { checkAuth } = useAuth()
  try {
    await checkAuth()
    await loadStats()
  } catch (error) {
    console.error('خطأ في تحميل بيانات الداشبورد:', error)
  }
})

// SEO والميتا
useHead({
  title: 'لوحة التحكم - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'لوحة تحكم إدارة موقع Wonder Land Traveling Agency' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
/* تحسينات إضافية */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* تحسين البطاقات */
.bg-white {
  transition: all 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
