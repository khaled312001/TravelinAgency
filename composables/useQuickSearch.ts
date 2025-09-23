import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export const useQuickSearch = () => {
  const router = useRouter()
  const { t } = useI18n()

  // Price ranges for quick filters
  const priceRanges = [
    { min: -1, max: -1 }, // Default "select budget" option
    { min: 4999, max: 6999 },
    { min: 7000, max: 9999 },
    { min: 10000, max: 14999 },
    { min: 15000, max: Infinity }
  ]

  // Duration ranges for quick filters
  const durationRanges = [
    { min: 4, max: 7 },
    { min: 7, max: 10 },
    { min: 10, max: 15 }
  ]

  // State
  const priceRange = ref<{ min: number; max: number }>({ min: -1, max: -1 })
  const durationRange = ref<{ min: number; max: number }>({ min: 0, max: 0 })

  // Quick filter methods
  function setPriceRange(min: number, max: number) {
    priceRange.value = { min, max }
  }

  function setDurationRange(min: number, max: number) {
    durationRange.value = { min, max }
  }

  // Navigation helper
  function navigateToSearch(params: Record<string, number>) {
    router.push({
      path: '/packages/search',
      query: Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, value.toString()])
      )
    })
  }

  // Formatting helpers
  function formatPrice(price: number) {
    return price === Infinity ? '∞' : price.toLocaleString('en-US')
  }

  function formatPriceRange(range: { min: number; max: number }) {
    if (range.min === -1 && range.max === -1) {
      return useI18n().t('search.select_budget')
    }
    if (range.max === Infinity) {
      return `${range.min.toLocaleString()}+`
    }
    return `${range.min.toLocaleString()}-${range.max.toLocaleString()}`
  }

  function formatDurationRange(range: { min: number; max: number }) {
    return `${range.min}-${range.max} ${t('search.days')}`
  }

  return {
    priceRanges,
    durationRanges,
    priceRange,
    durationRange,
    setPriceRange,
    setDurationRange,
    formatPriceRange,
    formatDurationRange
  }
}
