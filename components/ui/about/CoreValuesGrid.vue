<script setup lang="ts">
import { ref } from 'vue';

// Safe DOM reference handling pattern
const valuesSection = ref<HTMLElement | null>(null);
</script>

<template>
  <section 
    ref="valuesSection"
    class="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-100"
  >
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ $t('about.values.title') }}
        </h2>
        <p class="text-base md:text-lg text-gray-700">
          {{ $t('about.values.subtitle') }}
        </p>
      </div>
      
      <!-- Responsive grid with 1, 2, 3 columns based on screen size -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Value 1: Excellence -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:star" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.0.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.0.description') }}
          </p>
        </div>
        
        <!-- Value 2: Personalization -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:account-cog" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.1.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.1.description') }}
          </p>
        </div>
        
        <!-- Value 3: Innovation -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:lightbulb" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.2.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.2.description') }}
          </p>
        </div>
        
        <!-- Value 4: Integrity -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:shield-check" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.3.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.3.description') }}
          </p>
        </div>
        
        <!-- Value 5: Customer Focus -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:account-heart" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.4.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.4.description') }}
          </p>
        </div>
        
        <!-- Value 6: Partnership -->
        <div class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon name="mdi:handshake" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ $t('about.values.items.5.title') }}
          </h3>
          <p class="text-gray-700">
            {{ $t('about.values.items.5.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
