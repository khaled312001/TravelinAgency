<script setup lang="ts">
import { ref } from 'vue';

// Safe DOM reference handling pattern
const timelineSection = ref<HTMLElement | null>(null);
</script>

<template>
  <section 
    ref="timelineSection"
    class="py-12 md:py-16 lg:py-20 bg-gray-900 dark:bg-gray-900"
  >
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          {{ $t('about.timeline.title') }}
        </h2>
        <p class="text-base md:text-lg text-gray-300">
          {{ $t('about.timeline.subtitle') }}
        </p>
      </div>
      
      <!-- Timeline - Mobile first with responsive adjustments -->
      <div class="max-w-4xl mx-auto relative">
        <!-- Vertical line for timeline - hidden on mobile, shown on md+ -->
        <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>
        
        <!-- Timeline events -->
        <div class="space-y-12 md:space-y-0">
          <!-- Event 1 -->
          <div class="relative md:grid md:grid-cols-2 md:gap-8">
            <!-- Year marker -->
            <div class="md:flex items-center justify-end md:pr-8 md:text-right">
              <div class="bg-primary-500 text-white font-bold py-2 px-4 rounded-md inline-block mb-4 md:mb-0">
                {{ $t('about.timeline.events.0.year') }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-md md:col-start-2">
              <h3 class="text-xl font-semibold mb-3 text-white">
                {{ $t('about.timeline.events.0.title') }}
              </h3>
              <p class="text-gray-300">
                {{ $t('about.timeline.events.0.description') }}
              </p>
            </div>
            
            <!-- Timeline dot -->
            <div class="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-gray-800"></div>
          </div>
          
          <!-- Event 2 -->
          <div class="relative md:grid md:grid-cols-2 md:gap-8 md:flex-row-reverse">
            <!-- Year marker -->
            <div class="md:flex items-center justify-end md:text-left md:col-start-2 md:col-end-3 md:row-start-1 md:pl-8 md:pr-0">
              <div class="bg-primary-500 text-white font-bold py-2 px-4 rounded-md inline-block mb-4 md:mb-0">
                {{ $t('about.timeline.events.1.year') }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-md md:col-start-1 md:row-start-1">
              <h3 class="text-xl font-semibold mb-3 text-white">
                {{ $t('about.timeline.events.1.title') }}
              </h3>
              <p class="text-gray-300">
                {{ $t('about.timeline.events.1.description') }}
              </p>
            </div>
            
            <!-- Timeline dot -->
            <div class="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-gray-800"></div>
          </div>
          
          <!-- Event 3 -->
          <div class="relative md:grid md:grid-cols-2 md:gap-8">
            <!-- Year marker -->
            <div class="md:flex items-center justify-end md:pr-8 md:text-right">
              <div class="bg-primary-500 text-white font-bold py-2 px-4 rounded-md inline-block mb-4 md:mb-0">
                {{ $t('about.timeline.events.2.year') }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-md md:col-start-2">
              <h3 class="text-xl font-semibold mb-3 text-white">
                {{ $t('about.timeline.events.2.title') }}
              </h3>
              <p class="text-gray-300">
                {{ $t('about.timeline.events.2.description') }}
              </p>
            </div>
            
            <!-- Timeline dot -->
            <div class="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-gray-800"></div>
          </div>
          
          <!-- Event 4 -->
          <div class="relative md:grid md:grid-cols-2 md:gap-8 md:flex-row-reverse">
            <!-- Year marker -->
            <div class="md:flex items-center justify-end md:text-left md:col-start-2 md:col-end-3 md:row-start-1 md:pl-8 md:pr-0">
              <div class="bg-primary-500 text-white font-bold py-2 px-4 rounded-md inline-block mb-4 md:mb-0">
                {{ $t('about.timeline.events.3.year') }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-md md:col-start-1 md:row-start-1">
              <h3 class="text-xl font-semibold mb-3 text-white">
                {{ $t('about.timeline.events.3.title') }}
              </h3>
              <p class="text-gray-300">
                {{ $t('about.timeline.events.3.description') }}
              </p>
            </div>
            
            <!-- Timeline dot -->
            <div class="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-gray-800"></div>
          </div>
          
          <!-- Event 5 -->
          <div class="relative md:grid md:grid-cols-2 md:gap-8">
            <!-- Year marker -->
            <div class="md:flex items-center justify-end md:pr-8 md:text-right">
              <div class="bg-primary-500 text-white font-bold py-2 px-4 rounded-md inline-block mb-4 md:mb-0">
                {{ $t('about.timeline.events.4.year') }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-md md:col-start-2">
              <h3 class="text-xl font-semibold mb-3 text-white">
                {{ $t('about.timeline.events.4.title') }}
              </h3>
              <p class="text-gray-300">
                {{ $t('about.timeline.events.4.description') }}
              </p>
            </div>
            
            <!-- Timeline dot -->
            <div class="hidden md:block absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
