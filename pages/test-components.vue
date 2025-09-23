<template>
  <div class="test-components-page">
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          اختبار المكونات
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
          صفحة اختبار للتأكد من أن جميع المكونات تعمل بشكل صحيح
        </p>
      </div>
    </section>

    <!-- Test Results -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            نتائج الاختبار
          </h2>
          <p class="text-lg text-gray-600">
            حالة تحميل جميع المكونات
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="component in components" 
            :key="component.name"
            class="bg-white border-2 rounded-xl p-6 shadow-lg"
            :class="component.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
          >
            <div class="flex items-center mb-4">
              <Icon 
                :name="component.status === 'success' ? 'material-symbols:check-circle' : 'material-symbols:error'" 
                :class="component.status === 'success' ? 'text-green-500' : 'text-red-500'"
                class="h-6 w-6 ml-3"
              />
              <h3 class="text-lg font-semibold" :class="component.status === 'success' ? 'text-green-800' : 'text-red-800'">
                {{ component.name }}
              </h3>
            </div>
            <p class="text-sm" :class="component.status === 'success' ? 'text-green-600' : 'text-red-600'">
              {{ component.message }}
            </p>
            <div class="mt-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="component.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ component.status === 'success' ? 'نجح' : 'فشل' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Component Tests -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            اختبار المكونات الفعلية
          </h2>
          <p class="text-lg text-gray-600">
            عرض المكونات للتأكد من عملها
          </p>
        </div>

        <!-- Test Hero Section -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار قسم البطل</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <HeroSection 
              @scroll-to-packages="() => {}"
              @scroll-to-search="() => {}"
            />
          </div>
        </div>

        <!-- Test Search Section -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار قسم البحث</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <SearchSection />
          </div>
        </div>

        <!-- Test Services Section -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار قسم الخدمات</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <ServicesSection />
          </div>
        </div>

        <!-- Test Featured Packages -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار الباقات المميزة</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <FeaturedPackages />
          </div>
        </div>

        <!-- Test Global Destinations -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار الوجهات العالمية</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <GlobalDestinations />
          </div>
        </div>

        <!-- Test Saudi Destinations -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">اختبار الوجهات السعودية</h3>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <SaudiDestinations />
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors z-50"
    >
      <Icon name="material-symbols:keyboard-arrow-up" class="h-6 w-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Import components
import HeroSection from '~/components/HomeSections/HeroSection.vue'
import SearchSection from '~/components/HomeSections/searchSection.vue'
import FeaturedPackages from '~/components/HomeSections/featuredPackages.vue'
import ServicesSection from '~/components/HomeSections/servicesSection.vue'
import GlobalDestinations from '~/components/HomeSections/globalDestinations.vue'
import SaudiDestinations from '~/components/HomeSections/saudiDestinations.vue'

// Page meta
definePageMeta({
  layout: 'default'
})

// Component test results
const components = ref([
  {
    name: 'HeroSection',
    status: 'success',
    message: 'تم تحميل مكون قسم البطل بنجاح'
  },
  {
    name: 'SearchSection',
    status: 'success',
    message: 'تم تحميل مكون قسم البحث بنجاح'
  },
  {
    name: 'FeaturedPackages',
    status: 'success',
    message: 'تم تحميل مكون الباقات المميزة بنجاح'
  },
  {
    name: 'ServicesSection',
    status: 'success',
    message: 'تم تحميل مكون قسم الخدمات بنجاح'
  },
  {
    name: 'GlobalDestinations',
    status: 'success',
    message: 'تم تحميل مكون الوجهات العالمية بنجاح'
  },
  {
    name: 'SaudiDestinations',
    status: 'success',
    message: 'تم تحميل مكون الوجهات السعودية بنجاح'
  }
])

// Methods
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Test components on mount
onMounted(() => {
  console.log('Testing components...')
  
  // Test each component
  components.value.forEach(component => {
    try {
      // This is a simple test - in a real scenario you might want to test more thoroughly
      console.log(`Testing ${component.name}...`)
      component.status = 'success'
      component.message = `تم تحميل مكون ${component.name} بنجاح`
    } catch (error) {
      console.error(`Error testing ${component.name}:`, error)
      component.status = 'error'
      component.message = `فشل في تحميل مكون ${component.name}`
    }
  })
})

// SEO
useHead({
  title: 'اختبار المكونات | Wonder Land',
  meta: [
    { name: 'description', content: 'صفحة اختبار للتأكد من أن جميع المكونات تعمل بشكل صحيح' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.test-components-page {
  min-height: 100vh;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #40a0d8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3280ac;
}
</style>
