import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePackages } from './usePackages'

export interface PackageFilters {
  periods: string[]
  priceRange: {
    min: number
    max: number
  }
  duration: {
    min: number
    max: number
  }
  dates: {
    start: string | null
    end: string | null
  }
  travelers: number
  type: string[]
}

export const usePackageSearch = () => {
  const { locale } = useI18n()
  const { getPackages } = usePackages()
  
  // Search query
  const searchQuery = ref('')
  
  // Filters with default values
  const filters = ref<PackageFilters>({
    periods: [],
    priceRange: {
      min: 0,
      max: Infinity
    },
    duration: {
      min: 0,
      max: Infinity
    },
    dates: {
      start: null,
      end: null
    },
    travelers: 1,
    type: []
  })

  // Get packages
  const packages = computed(() => getPackages())

  // Get available filter options based on packages
  const filterOptions = computed(() => {
    const allPackages = packages.value || []
    if (allPackages.length === 0) {
      return {
        periods: [],
        priceRanges: [],
        durationRanges: []
      }
    }

    // Get unique travel periods
    const uniquePeriods = new Set<string>()
    allPackages.forEach(pkg => {
      if (pkg.travel_period) {
        uniquePeriods.add(pkg.travel_period)
      }
    })

    // Sort periods by month
    const monthOrder = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]
    const sortedPeriods = Array.from(uniquePeriods).sort((a, b) => {
      const aMonth = monthOrder.findIndex(month => 
        a.toLowerCase().includes(month)
      )
      const bMonth = monthOrder.findIndex(month => 
        b.toLowerCase().includes(month)
      )
      return aMonth - bMonth
    })

    // Month translations
    const monthTranslations: Record<string, { en: string, ar: string }> = {
      january: { en: 'January', ar: 'يناير' },
      february: { en: 'February', ar: 'فبراير' },
      march: { en: 'March', ar: 'مارس' },
      april: { en: 'April', ar: 'أبريل' },
      may: { en: 'May', ar: 'مايو' },
      june: { en: 'June', ar: 'يونيو' },
      july: { en: 'July', ar: 'يوليو' },
      august: { en: 'August', ar: 'أغسطس' },
      september: { en: 'September', ar: 'سبتمبر' },
      october: { en: 'October', ar: 'أكتوبر' },
      november: { en: 'November', ar: 'نوفمبر' },
      december: { en: 'December', ar: 'ديسمبر' }
    }

    return {
      periods: sortedPeriods.map(period => ({
        id: period,
        name: monthTranslations[period] || { en: period, ar: period }
      })),
      priceRanges: [
        { min: 0, max: 1000, label: 'Under $1,000' },
        { min: 1000, max: 3000, label: '$1,000 - $3,000' },
        { min: 3000, max: 5000, label: '$3,000 - $5,000' },
        { min: 5000, max: Infinity, label: 'Over $5,000' }
      ],
      durationRanges: [
        { min: 0, max: 3, label: '1-3 days' },
        { min: 4, max: 7, label: '4-7 days' },
        { min: 8, max: 14, label: '8-14 days' },
        { min: 15, max: Infinity, label: '15+ days' }
      ]
    }
  })

  // Filter packages based on current filters
  const filteredPackages = computed(() => {
    let results = packages.value || []

    // Apply search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      results = results.filter(pkg => 
        pkg.title_en.toLowerCase().includes(query) ||
        pkg.description_en.toLowerCase().includes(query)
      )
    }

    // Apply period filter
    if (filters.value.periods.length > 0) {
      results = results.filter(pkg => 
        filters.value.periods.some(period => 
          pkg.travel_period.toLowerCase() === period.toLowerCase()
        )
      )
    }

    // Apply price range filter
    if (filters.value.priceRange.min > 0 || filters.value.priceRange.max < Infinity) {
      results = results.filter(pkg => 
        pkg.price >= filters.value.priceRange.min &&
        pkg.price <= filters.value.priceRange.max
      )
    }

    // Apply duration filter
    if (filters.value.duration.min > 0 || filters.value.duration.max < Infinity) {
      results = results.filter(pkg => 
        pkg.duration_days >= filters.value.duration.min &&
        pkg.duration_days <= filters.value.duration.max
      )
    }

    return results
  })

  // Active filters count
  const activeFiltersCount = computed(() => {
    let count = 0
    count += filters.value.periods.length
    if (filters.value.priceRange.min !== 0 || filters.value.priceRange.max !== Infinity) count++
    if (filters.value.duration.min !== 0 || filters.value.duration.max !== Infinity) count++
    if (filters.value.dates.start && filters.value.dates.end) count++
    if (filters.value.travelers > 1) count++
    return count
  })

  // Reset all filters and search query
  const resetFilters = () => {
    searchQuery.value = ''
    filters.value = {
      periods: [],
      priceRange: {
        min: 0,
        max: Infinity
      },
      duration: {
        min: 0,
        max: Infinity
      },
      dates: {
        start: null,
        end: null
      },
      travelers: 1,
      type: []
    }
  }

  return {
    searchQuery,
    filters,
    filterOptions,
    filteredPackages,
    activeFiltersCount,
    resetFilters
  }
}
