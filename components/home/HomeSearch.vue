<template>
  <div class="relative max-w-2xl mx-auto">
    <!-- Search Bar -->
    <div 
      class="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
      @click="navigateToSearch"
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

      <!-- Search Input (Readonly) -->
      <input
        type="text"
        readonly
        :placeholder="$t('search.destinations_placeholder')"
        class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 cursor-pointer"
      />

      <!-- Search Button -->
      <button
        class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors text-sm hidden sm:block"
      >
        {{ $t('search.button') }}
      </button>
    </div>

    <!-- Popular Searches -->
    <div class="mt-4 flex flex-wrap gap-2 justify-center">
      <button
        v-for="category in popularCategories"
        :key="category.id"
        @click="navigateToSearch({ type: category.id })"
        class="px-4 py-2 rounded-full text-sm bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-gray-700 shadow-sm"
      >
        {{ category.name[locale] }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDestinationSearch } from '~/composables/useDestinationSearch'

const { locale } = useI18n()
const router = useRouter()
const { filterOptions } = useDestinationSearch()

// Get the first 4 destination types for quick access
const popularCategories = computed(() => 
  filterOptions.value.destinationTypes.slice(0, 4)
)

// Navigate to search page with optional pre-filled filters
const navigateToSearch = (presetFilter?: { type?: string }) => {
  if (presetFilter?.type) {
    router.push({
      path: '/search',
      query: { type: presetFilter.type }
    })
  } else {
    router.push('/search')
  }
}
</script>
