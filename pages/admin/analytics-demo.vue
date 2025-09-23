<template>
  <div class="space-y-6">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">عرض الرسوم البيانية</h1>
        <p class="mt-1 text-sm text-gray-600">عرض جميع أنواع الرسوم البيانية المتاحة</p>
      </div>
    </div>

    <!-- عرض جميع أنواع الرسوم البيانية -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- رسم بياني خطي -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">رسم بياني خطي - المبيعات</h3>
        <LineChart 
          :data="lineChartData" 
          :height="300"
          :options="lineChartOptions"
        />
      </div>

      <!-- رسم بياني عمودي -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">رسم بياني عمودي - الحجوزات</h3>
        <BarChart 
          :data="barChartData" 
          :height="300"
          :options="barChartOptions"
        />
      </div>

      <!-- رسم بياني دائري -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">رسم بياني دائري - توزيع العملاء</h3>
        <PieChart 
          :data="pieChartData" 
          :height="300"
          :options="pieChartOptions"
        />
      </div>

      <!-- رسم بياني حلقي -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">رسم بياني حلقي - توزيع الوجهات</h3>
        <DoughnutChart 
          :data="doughnutChartData" 
          :height="300"
          :options="doughnutChartOptions"
        />
      </div>
    </div>

    <!-- معلومات إضافية -->
    <div class="bg-blue-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">معلومات عن الرسوم البيانية</h3>
      <ul class="text-blue-800 space-y-2">
        <li>• جميع الرسوم البيانية تفاعلية ويمكن تكبيرها وتصغيرها</li>
        <li>• تدعم اللغة العربية والاتجاه من اليمين إلى اليسار</li>
        <li>• تتضمن أدوات تلميح (tooltips) لعرض التفاصيل</li>
        <li>• قابلة للتخصيص من ناحية الألوان والأحجام</li>
        <li>• متوافقة مع جميع أحجام الشاشات</li>
      </ul>
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

// بيانات الرسم البياني الخطي
const lineChartData = ref({
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

// بيانات الرسم البياني العمودي
const barChartData = ref({
  labels: ['دبي', 'تركيا', 'ماليزيا', 'تايلاند', 'مصر'],
  datasets: [{
    label: 'عدد الحجوزات',
    data: [25, 20, 18, 15, 12],
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
    ],
    borderWidth: 1
  }]
})

// بيانات الرسم البياني الدائري
const pieChartData = ref({
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

// بيانات الرسم البياني الحلقي
const doughnutChartData = ref({
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
const lineChartOptions = ref({
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

const barChartOptions = ref({
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

const pieChartOptions = ref({
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

const doughnutChartOptions = ref({
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

// SEO والميتا
useHead({
  title: 'عرض الرسوم البيانية - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'عرض جميع أنواع الرسوم البيانية المتاحة في النظام' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
