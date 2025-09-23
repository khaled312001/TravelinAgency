
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Active Filters -->
    <section class="relative bg-cover bg-center py-20">
      <div class="absolute inset-0">
        <NuxtImg
          src="/images/packages/home/packages-hero-bg.jpeg"
          alt="Stunning beachfront villa with private pool and ocean views"
          width="1920"
          height="1080"
          loading="eager"
          format="webp"
          quality="90"
          class="w-full h-full object-cover"
          placeholder
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
      </div>
      <div class="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ t('search.results.title') }}</h1>
        <div class="flex items-center justify-center text-1xl gap-2 text-sm md:text-base mb-6 w-full">
          <span v-if="filteredPackages.length > 0">
            {{ t('search.results.count', { count: filteredPackages.length }) }}
          </span>
          <span v-else>
            {{ t('search.results.empty') }}
          </span>
        </div>
        <!-- Active Filters Summary -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <!-- Destination Filter -->
          <div v-if="filters?.destinations && filters.destinations.length" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <span>{{ destinationNames.join(', ') }}</span>
          </div>

          <!-- Price Range Filter -->
          <div v-if="filters.priceRange.min !== 0 || filters.priceRange.max !== Infinity" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <SaudiRyialSymbol :size="20" class="text-white" />
            <span>{{ formatPriceRange(filters.priceRange) }}</span>
          </div>

          <!-- Duration Filter -->
          <div v-if="filters.duration.min !== 0 || filters.duration.max !== Infinity" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatDurationRange(filters.duration) }}</span>
          </div>

          <!-- Travelers Filter -->
          <div v-if="filters.travelers > 1" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{{ filters.travelers }} {{ t('search.travelers_count', { count: filters.travelers }) }}</span>
          </div>

          <!-- Clear All Filters -->
          <button 
            v-if="hasActiveFilters" 
            @click="clearFilters"
            class="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            {{ t('search.active_filters.clear_filters') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Search Results Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ t('common.error') }}
        </div>
        <div v-else-if="filteredPackages.length === 0" class="text-center">
          <p class="text-xl text-gray-600">{{ t('search.results.empty') }}</p>
          <button 
            @click="clearFilters"
            class="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            {{ t('search.actions.clear_filters') }}
          </button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PackageCard
            v-for="package_ in filteredPackages"
            :key="package_.id"
            :package_="package_"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePackages } from '~/composables/usePackages'
import { usePackageSearch } from '~/composables/usePackageSearch'
import type { Package } from '~/composables/usePackages'
import SaudiRyialSymbol from '~/components/ui/icons/SaudiRyialSymbol.vue'
import PackageCard from '~/components/packages/PackageCard.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { getPackages } = usePackages()
const { filters, searchQuery, filterOptions, resetFilters } = usePackageSearch()

// Initialize filters from URL parameters
onMounted(() => {
  const query = route.query

  // Reset filters first
  resetFilters()

  // Set search query
  if (query.q) {
    searchQuery.value = String(query.q)
  }

  // Set travel periods
  if (query.periods) {
    const periods = Array.isArray(query.periods) 
      ? query.periods 
      : query.periods.split(',')
    filters.value.destinations = periods.map(p => String(p))
  }

  // Set budget range from URL
  if (query.budget) {
    const budget = String(query.budget)
    switch (budget) {
      case 'low':
        filters.value.priceRange = { min: 0, max: 1000 }
        break
      case 'medium':
        filters.value.priceRange = { min: 1000, max: 3000 }
        break
      case 'high':
        filters.value.priceRange = { min: 3000, max: 5000 }
        break
      case 'luxury':
        filters.value.priceRange = { min: 5000, max: Infinity }
        break
    }
  }
  // If no budget but has price range
  else if (query.priceMin || query.priceMax) {
    filters.value.priceRange = {
      min: parseInt(query.priceMin as string) || 0,
      max: query.priceMax ? parseInt(query.priceMax as string) : Infinity
    }
  }

  // Set duration range
  if (query.durationMin || query.durationMax) {
    filters.value.duration = {
      min: parseInt(query.durationMin as string) || 0,
      max: query.durationMax ? parseInt(query.durationMax as string) : Infinity
    }
  }

  // Set travelers
  if (query.travelers) {
    filters.value.travelers = parseInt(query.travelers as string) || 1
  }

})

// Fetch all packages
const {
  data: packages,
  pending,
  error
} = await useAsyncData<Package[]>('packages', () => getPackages(), {
  default: () => []
})

// Get destination names for display
const destinationNames = computed(() => {
  if (!filters.value?.destinations) return []
  return filters.value.destinations.map(id => {
    const destination = filterOptions.value?.destinations?.find(d => d.id === id)
    return destination?.name?.[locale.value] || id
  })
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  if (!filters.value) return false
  return (filters.value.destinations?.length || 0) > 0 ||
    (filters.value.priceRange?.min || 0) !== 0 ||
    (filters.value.priceRange?.max || Infinity) !== Infinity ||
    (filters.value.duration?.min || 0) !== 0 ||
    (filters.value.duration?.max || Infinity) !== Infinity ||
    (filters.value.travelers || 1) > 1
})

// Clear all filters and navigate
const clearFilters = () => {
  resetFilters()
  router.push({ path: route.path })
}

// Format price range for display
const formatPriceRange = (range: { min: number, max: number }) => {
  if (range.max === Infinity) {
    return `${t('common.from')} ${range.min.toLocaleString()}`
  }
  return `${range.min.toLocaleString()} - ${range.max.toLocaleString()}`
}

// Format duration range for display
const formatDurationRange = (range: { min: number, max: number }) => {
  if (range.max === Infinity) {
    return `${t('common.from')} ${range.min} ${t('common.days')}`
  }
  return `${range.min} - ${range.max} ${t('common.days')}`
}

// Filter packages based on current filters
const filteredPackages = computed(() => {
  if (!packages.value) return []

  return packages.value.filter(package_ => {
    // Filter by search query
    if (searchQuery.value) {
      const searchLower = searchQuery.value.toLowerCase()
      const titleMatch = package_.title_en?.toLowerCase().includes(searchLower) || 
                        package_.title_ar?.toLowerCase().includes(searchLower)
      const descMatch = package_.description_en?.toLowerCase().includes(searchLower) || 
                       package_.description_ar?.toLowerCase().includes(searchLower)
      if (!titleMatch && !descMatch) {
        return false
      }
    }

    // Filter by travel periods if any are selected
    if (filters.value?.destinations?.length > 0) {
      // Get the package's travel period and convert to lowercase
      const packagePeriod = package_?.travel_period?.toLowerCase()
      if (!packagePeriod) return false

      // Check if the package period includes ANY of the selected periods
      const matches = filters.value.destinations.some(period => {
        // Convert both to lowercase for case-insensitive comparison
        const selectedPeriod = period.toLowerCase()
        // Check if the package period contains this month
        return packagePeriod.includes(selectedPeriod)
      })

      if (!matches) return false
    }

    // Filter by price range
    if (package_?.price_per_person < (filters.value?.priceRange?.min || 0) || 
        (filters.value?.priceRange?.max !== Infinity && package_?.price_per_person > filters.value.priceRange.max)) {
      return false
    }

    // Filter by duration
    if (package_?.duration_days < (filters.value?.duration?.min || 0) || 
        (filters.value?.duration?.max !== Infinity && package_?.duration_days > filters.value.duration.max)) {
      return false
    }

    // Filter by travelers
    if ((filters.value?.travelers || 1) > 1 && package_?.max_persons < filters.value.travelers) {
      return false
    }

    return true
  })
})

// Watch for changes in filters and update URL
watch([filters, searchQuery], ([newFilters, newSearchQuery]) => {
  // Update URL with current filters
  router.replace({
    query: {
      ...(newSearchQuery && { q: newSearchQuery }),
      ...(newFilters.destinations?.length && { periods: newFilters.destinations.join(',') }),
      ...(newFilters.priceRange.min > 0 && { priceMin: newFilters.priceRange.min }),
      ...(newFilters.priceRange.max < Infinity && { priceMax: newFilters.priceRange.max }),
      ...(newFilters.duration.min > 0 && { durationMin: newFilters.duration.min }),
      ...(newFilters.duration.max < Infinity && { durationMax: newFilters.duration.max }),
      ...(newFilters.travelers > 1 && { travelers: newFilters.travelers })
    }
  })
}, { deep: true })

definePageMeta({
  layout: 'default'
})
</script>