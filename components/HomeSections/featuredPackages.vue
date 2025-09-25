<template>
  <section id="packages-section" class="py-16 bg-surface" data-aos="fade-up">
    <div class="container">
      <div class="text-center mb-12" data-aos="fade-down">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {{ $t('home.featured.title') }}
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ $t('home.featured.subtitle') }}
        </p>
      </div>
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="inline-flex items-center gap-2 text-gray-600">
          <Icon name="material-symbols:refresh" class="h-6 w-6 animate-spin" />
          <span>جاري تحميل الباقات...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <Icon name="material-symbols:error" class="h-12 w-12 mx-auto mb-2" />
          <p>حدث خطأ في تحميل الباقات</p>
        </div>
        <button 
          @click="refresh()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- Packages Grid -->
      <div v-else-if="featuredPackages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(pkg, index) in featuredPackages"
          :key="pkg.id"
          data-aos="zoom-in"
          :data-aos-delay="100 * index"
        >
          <PackageCard :package_="pkg" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-500">
          <Icon name="material-symbols:package-2-outline" class="h-12 w-12 mx-auto mb-4" />
          <p>لا توجد باقات مميزة متاحة حالياً</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PackageCard from '~/components/packages/PackageCard.vue'
import { usePackages } from '~/composables/usePackages'

const { packages, pending, error, refresh } = usePackages()
const featuredPackages = computed(() => {
  const allPackages = packages.value || []
  console.log('All packages in featuredPackages:', allPackages)
  const featured = allPackages.filter(pkg => pkg.featured === true || pkg.featured === 1)
  console.log('Featured packages:', featured)
  return featured
})

// Refresh packages on mount
onMounted(() => {
  console.log('FeaturedPackages mounted, refreshing...')
  refresh()
})

// Watch for packages data changes
watch(() => packages.value, (newPackages) => {
  console.log('Packages data changed:', newPackages)
  console.log('Featured packages after change:', featuredPackages.value)
}, { immediate: true })
</script>
