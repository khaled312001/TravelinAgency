<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="material-symbols:refresh" class="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p class="text-gray-600">جاري تحميل المحتوى...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="material-symbols:error" class="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p class="text-gray-600 mb-4">حدث خطأ في تحميل المحتوى</p>
        <button 
          @click="loadHomePageContent"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>

    <!-- CMS Content -->
    <div v-else-if="homePageSections && homePageSections.length > 0">
      <CMSRenderer
        v-for="section in homePageSections"
        :key="section.id"
        :section="section"
      />
    </div>

    <!-- Original Content (Fallback) -->
    <div v-else>
      <!-- Hero Section with Video Background -->
      <HeroSection 
        @scroll-to-packages="scrollToPackages"
        @scroll-to-search="scrollToSearch"
      />

      <!-- Search Section -->
      <SearchSection ref="searchSectionRef" />

      <!-- Services Section -->
      <ServicesSection />

      <!-- Featured Packages Section -->
      <FeaturedPackages ref="packagesSectionRef" />

      <!-- Global Destinations -->
      <GlobalDestinations />

      <!-- Saudi Destinations -->
      <SaudiDestinations />
    </div>
  </div>
</template>

<script setup>
// Import components
import HeroSection from '~/components/HomeSections/HeroSection.vue'
import SearchSection from '~/components/HomeSections/searchSection.vue'
import FeaturedPackages from '~/components/HomeSections/featuredPackages.vue'
import ServicesSection from '~/components/HomeSections/servicesSection.vue'
import GlobalDestinations from '~/components/HomeSections/globalDestinations.vue'
import SaudiDestinations from '~/components/HomeSections/saudiDestinations.vue'
import CMSRenderer from '~/components/cms/CMSRenderer.vue'

definePageMeta({
  layout: 'default'
})

// State
const loading = ref(true)
const error = ref(false)
const homePageSections = ref([])
const searchSectionRef = ref(null)
const packagesSectionRef = ref(null)

// Methods
const loadHomePageContent = async () => {
  try {
    loading.value = true
    error.value = false
    
    // Always use original content for now
    // TODO: Enable CMS content when needed
    homePageSections.value = []
  } catch (err) {
    console.error('Error loading homepage content:', err)
    error.value = true
    homePageSections.value = []
  } finally {
    loading.value = false
  }
}

// Navigation methods
const scrollToSearch = () => {
  if (searchSectionRef.value) {
    searchSectionRef.value.$el.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToPackages = () => {
  if (packagesSectionRef.value) {
    packagesSectionRef.value.$el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Load content on mount
onMounted(() => {
  loadHomePageContent()
})

// Check if home page is published
definePageMeta({
  middleware: 'page-access'
})

// Set page meta
useHead({
  title: 'Wonder Land - وكالة السفر الرائدة',
  meta: [
    { name: 'description', content: 'وكالة السفر الرائدة في المملكة العربية السعودية. اكتشف أفضل الوجهات السياحية معنا.' }
  ]
})
</script>
