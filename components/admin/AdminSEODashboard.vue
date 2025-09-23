<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">إحصائيات SEO</h3>
      <NuxtLink
        to="/admin/seo"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        عرض التفاصيل
      </NuxtLink>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ seoStats.indexedPages }}</div>
        <div class="text-sm text-gray-600">صفحات مفهرسة</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ seoStats.performanceScore }}%</div>
        <div class="text-sm text-gray-600">معدل الأداء</div>
      </div>
    </div>

    <!-- شريط التقدم -->
    <div class="mb-4">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>حالة SEO</span>
        <span>{{ seoStats.performanceScore }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="getProgressColor(seoStats.performanceScore)"
          :style="{ width: `${seoStats.performanceScore}%` }"
        ></div>
      </div>
    </div>

    <!-- مشاكل SEO -->
    <div v-if="seoStats.seoIssues > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <div class="flex items-center">
        <Icon name="material-symbols:warning" class="h-5 w-5 text-orange-600 ml-2" />
        <div>
          <div class="text-sm font-medium text-orange-800">
            {{ seoStats.seoIssues }} مشكلة SEO تحتاج انتباه
          </div>
          <div class="text-xs text-orange-600">
            راجع صفحة إدارة SEO لحل هذه المشاكل
          </div>
        </div>
      </div>
    </div>

    <!-- توصيات سريعة -->
    <div v-if="recommendations.length > 0" class="mt-4">
      <h4 class="text-sm font-medium text-gray-900 mb-2">توصيات سريعة</h4>
      <ul class="space-y-1">
        <li
          v-for="(recommendation, index) in recommendations.slice(0, 3)"
          :key="index"
          class="text-xs text-gray-600 flex items-center"
        >
          <Icon name="material-symbols:check-circle-outline" class="h-3 w-3 text-green-500 ml-1" />
          {{ recommendation }}
        </li>
      </ul>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-5 w-5 text-blue-600" />
      <span class="mr-2 text-sm text-gray-600">جارٍ التحميل...</span>
    </div>
  </div>
</template>

<script setup>
const { seoStats, loading, getSeoRecommendations, loadSeoData } = useSEO()

// تحميل البيانات
onMounted(() => {
  loadSeoData()
})

// التوصيات
const recommendations = computed(() => {
  return getSeoRecommendations()
})

// لون شريط التقدم
const getProgressColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}
</script>
