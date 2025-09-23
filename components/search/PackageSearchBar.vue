<template>
  <div class="relative">
    <div 
      class="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
      :class="{ 'ring-2 ring-primary ring-opacity-50': focused }"
    >
      <!-- Search Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>

      <!-- Search Input -->
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="onFocus"
        @blur="onBlur"
        :placeholder="$t('search.packages_placeholder')"
        class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
      />

      <!-- Clear Button -->
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 text-gray-400" 
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

      <!-- Filter Button -->
      <button
        @click="$emit('toggle-filters')"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        :class="{ 'text-primary': showFilters }"
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
          />
        </svg>
        
        <!-- Filter Badge -->
        <span 
          v-if="activeFiltersCount > 0"
          class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
        >
          {{ activeFiltersCount }}
        </span>
      </button>

      <!-- Quick Filters -->
      <div class="hidden lg:flex items-center gap-2 border-l pl-4 ml-2">
        <!-- Date Picker Trigger -->
        <button
          @click="$emit('toggle-date-picker')"
          class="px-3 py-1.5 rounded-full text-sm bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          {{ selectedDates || $t('search.select_dates') }}
        </button>

        <!-- Travelers Selector -->
        <button
          @click="$emit('toggle-travelers')"
          class="px-3 py-1.5 rounded-full text-sm bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          {{ $t('search.travelers', { count: travelers }) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  showFilters: boolean
  activeFiltersCount: number
  selectedDates?: string
  travelers: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-filters'): void
  (e: 'toggle-date-picker'): void
  (e: 'toggle-travelers'): void
}>()

const focused = ref(false)

const onFocus = () => {
  focused.value = true
}

const onBlur = () => {
  focused.value = false
}
</script>
