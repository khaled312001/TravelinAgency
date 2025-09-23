<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-25 z-50 md:relative md:bg-transparent"
    @click.self="$emit('close')"
  >
    <div 
      class="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 shadow-xl md:relative md:rounded-2xl md:shadow-lg"
      :class="{ 
        'translate-y-0 opacity-100': show,
        'translate-y-full opacity-0': !show 
      }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ $t('search.filters') }}
        </h2>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <!-- Filter Groups -->
      <div class="space-y-6 max-h-[60vh] overflow-y-auto md:max-h-[400px]">
        <!-- Regions -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_region') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="region in filterOptions.regions"
              :key="region.id"
              @click="toggleFilter('regions', region.id)"
              class="px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.regions.includes(region.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ region.name[locale] }}
            </button>
          </div>
        </div>

        <!-- Destination Types -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_type') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in filterOptions.destinationTypes"
              :key="type.id"
              @click="toggleFilter('destinationTypes', type.id)"
              class="px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.destinationTypes.includes(type.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ type.name[locale] }}
            </button>
          </div>
        </div>

        <!-- Location Types -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_location') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in filterOptions.locationTypes"
              :key="type.id"
              @click="toggleFilter('locationTypes', type.id)"
              class="px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.locationTypes.includes(type.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ type.name[locale] }}
            </button>
          </div>
        </div>

        <!-- Additional Filters -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_additional') }}</h3>
          <div class="space-y-2">
            <button
              @click="toggleBooleanFilter('hasEvents')"
              class="w-full px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.hasEvents === true
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ $t('search.filters_has_events') }}
            </button>
            <button
              @click="toggleBooleanFilter('hasTouristSpots')"
              class="w-full px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.hasTouristSpots === true
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ $t('search.filters_has_spots') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t">
        <button
          @click="$emit('reset')"
          class="text-gray-600 hover:text-gray-900 transition-colors text-sm"
        >
          {{ $t('common.reset_all') }}
        </button>
        <button
          @click="$emit('close')"
          class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
        >
          {{ $t('common.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DestinationFilters } from '~/composables/useDestinationSearch'

const props = defineProps<{
  show: boolean
  filters: DestinationFilters
  filterOptions: {
    regions: Array<{ id: string; name: { en: string; ar: string } }>
    destinationTypes: Array<{ id: string; name: { en: string; ar: string } }>
    locationTypes: Array<{ id: string; name: { en: string; ar: string } }>
  }
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: DestinationFilters): void
  (e: 'close'): void
  (e: 'reset'): void
}>()

const { locale } = useI18n()

const toggleFilter = (type: keyof DestinationFilters, value: string) => {
  const newFilters = { ...props.filters }
  const index = (newFilters[type] as string[]).indexOf(value)
  
  if (index === -1) {
    (newFilters[type] as string[]).push(value)
  } else {
    (newFilters[type] as string[]).splice(index, 1)
  }
  
  emit('update:filters', newFilters)
}

const toggleBooleanFilter = (type: 'hasEvents' | 'hasTouristSpots') => {
  const newFilters = { ...props.filters }
  newFilters[type] = newFilters[type] === true ? null : true
  emit('update:filters', newFilters)
}
</script>

<style scoped>
.translate-y-full {
  transform: translateY(100%);
}

.translate-y-0 {
  transform: translateY(0);
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

/* Transition classes */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
