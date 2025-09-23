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
      <div class="space-y-6 max-h-[60vh] overflow-y-auto md:max-h-[400px] hide-scrollbar">
        <!-- Destinations -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_destination') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="destination in filterOptions.destinations"
              :key="destination.id"
              @click="toggleFilter('destinations', destination.id)"
              class="px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.destinations.includes(destination.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ destination.name[locale] }}
            </button>
          </div>
        </div>

        <!-- Price Range -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_price') }}</h3>
          <div class="space-y-2">
            <button
              v-for="(range, index) in filterOptions.priceRanges"
              :key="index"
              @click="setPriceRange(range.min, range.max)"
              class="w-full px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.priceRange.min === range.min && filters.priceRange.max === range.max
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ formatPriceRange(range) }}
            </button>
          </div>
        </div>

        <!-- Duration -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_duration') }}</h3>
          <div class="space-y-2">
            <button
              v-for="range in filterOptions.durationRanges"
              :key="range.label.en"
              @click="setDurationRange(range.min, range.max)"
              class="w-full px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.duration.min === range.min && filters.duration.max === range.max
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ range.label[locale] }}
            </button>
          </div>
        </div>

        <!-- Dates -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_dates') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-sm text-gray-600 mb-1 block">{{ $t('search.start_date') }}</label>
              <input
                type="date"
                v-model="filters.dates.start"
                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="text-sm text-gray-600 mb-1 block">{{ $t('search.end_date') }}</label>
              <input
                type="date"
                v-model="filters.dates.end"
                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Travelers -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_travelers') }}</h3>
          <div class="flex items-center gap-4">
            <button
              @click="decrementTravelers"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              :disabled="filters.travelers <= 1"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M20 12H4" 
                />
              </svg>
            </button>
            <span class="text-lg font-medium">{{ filters.travelers }}</span>
            <button
              @click="incrementTravelers"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              :disabled="filters.travelers >= 10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Package Types -->
        <div class="space-y-3">
          <h3 class="font-medium text-gray-900">{{ $t('search.filters_type') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in filterOptions.types"
              :key="type.id"
              @click="toggleFilter('type', type.id)"
              class="px-4 py-2 rounded-full text-sm transition-colors text-start"
              :class="[
                filters.type.includes(type.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ type.name[locale] }}
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PackageFilters } from '~/composables/usePackageSearch'

const props = defineProps<{
  show: boolean
  filters: PackageFilters
  filterOptions: {
    destinations: Array<{ id: string; name: { en: string; ar: string } }>
    priceRanges: Array<{ min: number; max: number }>
    durationRanges: Array<{ min: number; max: number; label: { en: string; ar: string } }>
    types: Array<{ id: string; name: { en: string; ar: string } }>
  }
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: PackageFilters): void
  (e: 'close'): void
  (e: 'reset'): void
}>()

const { locale, t } = useI18n()

const toggleFilter = (type: 'destinations' | 'type', value: string) => {
  const newFilters = { ...props.filters }
  const index = newFilters[type].indexOf(value)
  
  if (index === -1) {
    newFilters[type].push(value)
  } else {
    newFilters[type].splice(index, 1)
  }
  
  emit('update:filters', newFilters)
}

const setPriceRange = (min: number, max: number) => {
  const newFilters = { ...props.filters }
  if (newFilters.priceRange.min === min && newFilters.priceRange.max === max) {
    newFilters.priceRange = { min: null, max: null }
  } else {
    newFilters.priceRange = { min, max }
  }
  emit('update:filters', newFilters)
}

const setDurationRange = (min: number, max: number) => {
  const newFilters = { ...props.filters }
  if (newFilters.duration.min === min && newFilters.duration.max === max) {
    newFilters.duration = { min: null, max: null }
  } else {
    newFilters.duration = { min, max }
  }
  emit('update:filters', newFilters)
}

const incrementTravelers = () => {
  if (props.filters.travelers < 10) {
    emit('update:filters', {
      ...props.filters,
      travelers: props.filters.travelers + 1
    })
  }
}

const decrementTravelers = () => {
  if (props.filters.travelers > 1) {
    emit('update:filters', {
      ...props.filters,
      travelers: props.filters.travelers - 1
    })
  }
}

const formatPriceRange = (range: { min: number; max: number }) => {
  return t('search.price_range', {
    min: range.min.toLocaleString(),
    max: range.max.toLocaleString()
  })
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

/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
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
