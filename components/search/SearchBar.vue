<template>
  <div class="relative">
    <div 
      class="flex items-center gap-3 bg-white rounded-full border border-gray-200 px-4 py-3 shadow-sm focus-within:shadow-lg focus-within:border-primary transition-all duration-300"
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
        :placeholder="$t('search.destinations_placeholder')"
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
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  showFilters: boolean
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-filters'): void
}>()

const focused = ref(false)

const onFocus = () => {
  focused.value = true
}

const onBlur = () => {
  focused.value = false
}
</script>
