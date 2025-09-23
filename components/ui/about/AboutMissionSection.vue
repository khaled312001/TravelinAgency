<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

// Following our DOM reference safety patterns
const missionSection = ref<HTMLElement | null>(null);

// Safely clean up resources when component unmounts
onUnmounted(() => {
  // Clean up any event listeners if needed
});
</script>

<template>
  <section 
    ref="missionSection" 
    class="py-12 md:py-16 lg:py-20 bg-gray-900 dark:bg-gray-900"
  >
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
          {{ $t('about.mission.title') }}
        </h2>
        <p class="text-gray-300 text-lg mb-10">
          {{ $t('about.mission.subtitle') }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <!-- Mission -->
          <div class="bg-gray-800 p-6 rounded-lg">
            <div class="mb-6 flex justify-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-700 text-primary-500 backdrop-blur-sm">
                <Icon name="mdi:flag" class="text-2xl" />
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-white">
              {{ $t('about.mission.mission_title') }}
            </h3>
            <p class="text-gray-300">
              {{ $t('about.mission.mission_text') }}
            </p>
          </div>
          
          <!-- Vision -->
          <div class="bg-gray-800 p-6 rounded-lg">
            <div class="mb-6 flex justify-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-700 text-primary-500 backdrop-blur-sm">
                <Icon name="mdi:eye" class="text-2xl" />
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-white">
              {{ $t('about.mission.vision_title') }}
            </h3>
            <p class="text-gray-300">
              {{ $t('about.mission.vision_text') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
