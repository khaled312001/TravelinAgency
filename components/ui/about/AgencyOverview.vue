<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <section class="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-100">
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <!-- About Us Section - Moved to top for better flow -->
      <div class="max-w-4xl mx-auto mb-16">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
          {{ $t('about.overview.title') }}
        </h2>
        
        <div class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-200 dark:to-gray-300 p-6 md:p-8 rounded-xl shadow-sm mb-8">
          <p class="text-gray-700 text-lg leading-relaxed">
            {{ $t('about.overview.intro') }}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-xl font-semibold mb-4 text-primary-600">
            {{ $t('about.overview.about_title') }}
          </h3>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('about.overview.about_text') }}
          </p>
        </div>
      </div>
      
      <!-- Why Choose Us Section - Redesigned with cards -->
      <div class="max-w-5xl mx-auto mb-16">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
          {{ $t('about.overview.why_choose_us') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(benefit, index) in 6" :key="index" 
               class="bg-white dark:bg-gray-50 p-6 rounded-xl shadow-sm border-l-4 border-primary-500 hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div class="text-primary-500 mb-4">
              <!-- Icon styled similar to ServicesSection -->
              <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
                <Icon name="mdi:check-circle" class="text-2xl" />
              </div>
            </div>
            <p class="text-gray-700 flex-grow">{{ $t(`about.overview.benefits.${index}`) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Why Us Section - Redesigned with alternating background -->
      <div class="max-w-4xl mx-auto">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
          {{ $t('about.overview.why_us') }}
        </h3>
        
        <div class="space-y-4 mb-12">
          <div v-for="(reason, index) in 4" :key="index" 
               class="flex p-5 rounded-lg" 
               :class="index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-200' : 'bg-white dark:bg-gray-100'">
            <!-- Icon styled similar to ServicesSection with RTL/LTR support -->
            <div class="flex-shrink-0 self-start ltr:mr-8 rtl:ml-8">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
                <Icon name="mdi:check-circle" class="text-xl" />
              </div>
            </div>
            <div class="flex-1 flex items-center">
              <p class="text-gray-700 font-medium">{{ $t(`about.overview.reasons.${index}`) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-primary-50 dark:bg-gray-200 p-6 rounded-xl italic text-center mb-12">
          <p class="text-gray-700 text-lg">
            {{ $t('about.overview.closing') }}
          </p>
        </div>
        
        <!-- CTA Section - Softened design -->
        <div class="text-center py-8 px-6 border border-primary-100 rounded-xl mb-8">
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {{ $t('about.hero.cta_title') }}
          </h3>
          <NuxtLink 
            :to="localePath('packages')" 
            class="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 shadow-sm"
          >
            {{ $t('about.hero.cta') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
