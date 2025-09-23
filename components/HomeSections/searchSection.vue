<template>
  <section class="search-section relative py-24 bg-gradient-to-b from-primary/10 to-surface-container-low">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 opacity-50"></div>
    </div>

    <div class="container relative">
      <div class="max-w-4xl mx-auto">
        <!-- Search Header -->
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {{ $t('search.find_perfect_package') }}
          </h2>
          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {{ $t('search.search_description') }}
          </p>
        </div>

        <!-- Main Search Bar -->
        <div class="bg-white rounded-3xl shadow-xl p-12 h-auto w-full max-w-5xl mx-auto">
          <div class="flex flex-col gap-6">
            <!-- Search Form -->
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Destination Input -->
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-2">
                  {{ $t('search.where_to') }}
                </label>
                <div class="relative">
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <Icon name="material-symbols:search" class="h-6 w-6 text-gray-400" />
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="$t('search.packages_placeholder')"
                    class="w-full ps-12 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <!-- Travel Period -->
              <div class="flex-1 relative">
                <label class="block text-base font-medium text-gray-700 mb-2">
                  {{ $t('search.when') }}
                </label>
                <button
                  id="period-button"
                  @click.stop="showPeriodSelector = !showPeriodSelector"
                  class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <Icon name="material-symbols:calendar-month-outline" class="h-6 w-6 text-gray-400" />
                    <span class="text-base text-gray-600">
                      {{ selectedPeriodsDisplay }}
                    </span>
                  </span>
                  <Icon name="material-symbols:keyboard-arrow-down-rounded" class="h-5 w-5 text-gray-400" />
                </button>

                <!-- Desktop Period Dropdown -->
                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div
                    id="period-dropdown"
                    v-if="showPeriodSelector && !isMobile"
                    class="absolute left-0 mt-2 w-[400px] bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                    @click.stop
                  >
                    <div class="p-4">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <h3 class="text-lg font-medium">{{ $t('search.when') }}</h3>
                          <p class="text-sm text-gray-500 mt-0.5">{{ $t('search.when_subtitle') }}</p>
                        </div>
                        <button
                          @click="showPeriodSelector = false"
                          class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Icon name="material-symbols:close" class="w-5 h-5" />
                        </button>
                      </div>
                      <div class="grid grid-cols-3 gap-2">
                        <button
                          v-for="period in periods"
                          :key="period.id"
                          @click.stop="selectPeriod(period.id)"
                          class="px-4 py-2.5 rounded-lg text-base transition-colors text-center"
                          :class="[
                            selectedPeriods.includes(period.id)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          ]"
                        >
                          {{ period.name[locale.substring(0, 2) as 'en' | 'ar'] }}
                        </button>
                      </div>
                      <div class="mt-6 flex justify-end">
                        <button
                          class="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-600 transition-colors disabled:opacity-50"
                          :disabled="selectedPeriods.length === 0"
                          @click.stop="confirmPeriods"
                        >
                          {{ $t('search.confirm') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Budget -->
              <div class="flex-1 relative">
                <label class="block text-base font-medium text-gray-700 mb-2">
                  {{ $t('search.budget') }}
                </label>
                <button
                  id="budget-button"
                  @click.stop="openBudgetMenu"
                  class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <SaudiRyialSymbol 
                      :size="20"
                      class="text-gray-400"
                    />
                    <span class="text-base text-gray-600">
                      {{ priceRange.min > 0 ? formatPriceRange(priceRange) : $t('search.select_budget') }}
                    </span>
                  </span>
                  <Icon name="material-symbols:keyboard-arrow-down-rounded" class="h-5 w-5 text-gray-400" />
                </button>

                <!-- Desktop Budget Dropdown -->
                <div
                  v-if="showBudgetMenu && !isMobile"
                  id="budget-dropdown"
                  class="absolute z-10 w-[400px] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                >
                  <div class="p-4">
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <h3 class="text-lg font-medium">{{ $t('search.budget_label') }}</h3>
                        <p class="text-sm text-gray-500 mt-0.5">{{ $t('search.budget_subtitle') }}</p>
                      </div>
                      <button
                        @click="closeBudgetMenu"
                        class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Icon name="material-symbols:close" class="w-5 h-5" />
                      </button>
                    </div>
                    <div class="space-y-2">
                      <button
                        v-for="(range, index) in priceRanges"
                        :key="'price-' + index"
                        @click="setPriceRange(range.min, range.max)"
                        class="w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors"
                        :class="[
                          priceRange.min === range.min && priceRange.max === range.max
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]"
                      >
                        <SaudiRyialSymbol 
                          :size="20"
                          :class="[
                            priceRange.min === range.min && priceRange.max === range.max 
                              ? 'text-primary' 
                              : 'text-gray-400'
                          ]"
                        />
                        {{ formatPriceRange(range) }}
                      </button>
                    </div>
                    <div class="mt-6 flex justify-end">
                      <button
                        class="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-600 transition-colors disabled:opacity-50"
                        :disabled="(!priceRange.min && !priceRange.max) || (priceRange.min === priceRanges[0].min && priceRange.max === priceRanges[0].max)"
                        @click.stop="confirmBudget"
                      >
                        {{ $t('search.confirm') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Mobile Budget Menu -->
                <div
                  v-if="isMobileBudgetOpen"
                  id="mobile-budget-menu"
                  class="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50"
                  @click="isMobileBudgetOpen = false"
                >
                  <div 
                    class="w-full bg-white rounded-t-xl"
                    @click.stop
                  >
                    <div class="p-4">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <h3 class="text-lg font-medium">{{ $t('search.budget_label') }}</h3>
                          <p class="text-sm text-gray-500 mt-0.5">{{ $t('search.budget_subtitle') }}</p>
                        </div>
                        <button
                          @click="isMobileBudgetOpen = false"
                          class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Icon name="material-symbols:close" class="w-5 h-5" />
                        </button>
                      </div>
                      <div class="space-y-2">
                        <button
                          v-for="(range, index) in priceRanges"
                          :key="'price-' + index"
                          @click.stop="setPriceRange(range.min, range.max)"
                          class="w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors"
                          :class="[
                            priceRange.min === range.min && priceRange.max === range.max
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          ]"
                        >
                          <SaudiRyialSymbol 
                            :size="20"
                            :class="[
                              priceRange.min === range.min && priceRange.max === range.max 
                                ? 'text-primary' 
                                : 'text-gray-400'
                            ]"
                          />
                          {{ formatPriceRange(range) }}
                        </button>
                      </div>
                      <div class="mt-6 flex justify-end">
                        <button
                          class="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-600 transition-colors disabled:opacity-50"
                          :disabled="(!priceRange.min && !priceRange.max) || (priceRange.min === priceRanges[0].min && priceRange.max === priceRanges[0].max)"
                          @click.stop="confirmBudget"
                        >
                          {{ $t('search.confirm') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="flex mt-2">
              <button
                @click="navigateToSearch"
                class="w-full h-12 px-8 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="material-symbols:search" class="h-5 w-5" />
                {{ $t('search.find_perfect_package') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Only show bottom sheets on mobile -->
    <template v-if="isMobile">
      <!-- Period Selector Modal -->
      <Transition name="fade">
        <div 
          v-if="showPeriodSelector"
          class="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50"
          @click="showPeriodSelector = false"
        >
          <div 
            class="w-full bg-white rounded-t-xl"
            @click.stop
          >
            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-medium">{{ $t('search.when') }}</h3>
                  <p class="text-sm text-gray-500 mt-0.5">{{ $t('search.when_subtitle') }}</p>
                </div>
                <button
                  @click="showPeriodSelector = false"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Icon name="material-symbols:close" class="w-5 h-5" />
                </button>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="period in periods"
                  :key="period.id"
                  @click.stop="selectPeriod(period.id)"
                  class="px-4 py-3 rounded-xl text-base transition-colors text-center"
                  :class="[
                    selectedPeriods.includes(period.id)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ period.name[locale.substring(0, 2) as 'en' | 'ar'] }}
                </button>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  class="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-600 transition-colors disabled:opacity-50"
                  :disabled="selectedPeriods.length === 0"
                  @click.stop="confirmPeriods"
                >
                  {{ $t('search.confirm') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuickSearch } from '~/composables/useQuickSearch'
import SaudiRyialSymbol from '~/components/ui/icons/SaudiRyialSymbol.vue'

const router = useRouter()
const localeRoute = useLocaleRoute()
const { locale, t } = useI18n()

// Confirm period selection
function confirmPeriods() {
  showPeriodSelector.value = false;
  // Any additional logic to finalize the selection can go here
}

// Confirm budget selection
function confirmBudget() {
  isMobileBudgetOpen.value = false;
  showBudgetMenu.value = false;
  // Any additional logic to finalize the budget selection can go here
}
const {
  priceRanges,
  durationRanges,
  priceRange,
  durationRange,
  setPriceRange,
  setDurationRange,
  formatPriceRange,
  formatDurationRange
} = useQuickSearch()

// Initialize state
const searchQuery = ref('')
const selectedPeriods = ref<string[]>([])

// Control panel visibility
const showPeriodSelector = ref(false)
const showBudgetMenu = ref(false)
const isMobileBudgetOpen = ref(false)

// Check if mobile
const isMobile = ref(false)

// Available periods (months)
const periods = [
  { id: 'january', name: { en: 'January', ar: 'يناير' } },
  { id: 'february', name: { en: 'February', ar: 'فبراير' } },
  { id: 'march', name: { en: 'March', ar: 'مارس' } },
  { id: 'april', name: { en: 'April', ar: 'أبريل' } },
  { id: 'may', name: { en: 'May', ar: 'مايو' } },
  { id: 'june', name: { en: 'June', ar: 'يونيو' } },
  { id: 'july', name: { en: 'July', ar: 'يوليو' } },
  { id: 'august', name: { en: 'August', ar: 'أغسطس' } },
  { id: 'september', name: { en: 'September', ar: 'سبتمبر' } },
  { id: 'october', name: { en: 'October', ar: 'أكتوبر' } },
  { id: 'november', name: { en: 'November', ar: 'نوفمبر' } },
  { id: 'december', name: { en: 'December', ar: 'ديسمبر' } }
]

// Update isMobile on mount and resize
onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const periodButton = document.querySelector('#period-button')
    const periodDropdown = document.querySelector('#period-dropdown')
    const budgetButton = document.querySelector('#budget-button')
    const budgetDropdown = document.querySelector('#budget-dropdown')
    const mobileBudgetMenu = document.querySelector('#mobile-budget-menu')

    // Close period selector if clicking outside both button and dropdown
    if (
      showPeriodSelector.value &&
      !periodButton?.contains(target) &&
      !periodDropdown?.contains(target)
    ) {
      showPeriodSelector.value = false
    }

    // Close desktop budget menu if clicking outside both button and dropdown
    if (
      !isMobile.value &&
      showBudgetMenu.value &&
      !budgetButton?.contains(target) &&
      !budgetDropdown?.contains(target)
    ) {
      showBudgetMenu.value = false
    }

    // Close mobile budget menu if clicking outside
    if (
      isMobile.value &&
      isMobileBudgetOpen.value &&
      !mobileBudgetMenu?.contains(target)
    ) {
      isMobileBudgetOpen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

function checkIfMobile() {
  isMobile.value = window.innerWidth < 768
}

// Handle period selection
const selectPeriod = (periodId: string) => {
  const index = selectedPeriods.value.indexOf(periodId)
  if (index === -1) {
    selectedPeriods.value.push(periodId)
  } else {
    selectedPeriods.value.splice(index, 1)
  }
}

// Budget menu controls
function openBudgetMenu() {
  if (isMobile.value) {
    isMobileBudgetOpen.value = true
  } else {
    showBudgetMenu.value = true
  }
}

function closeBudgetMenu() {
  if (isMobile.value) {
    isMobileBudgetOpen.value = false
  } else {
    showBudgetMenu.value = false
  }
}

// Navigation method
function navigateToSearch() {
  const query: Record<string, string | string[]> = {}

  // Add periods if selected
  if (selectedPeriods.value.length > 0) {
    query.periods = selectedPeriods.value
  }

  // Add price range if set and not default
  const currentPriceRange = priceRange.value
  if (currentPriceRange && currentPriceRange.min !== -1 && currentPriceRange.max !== -1) {
    query.priceMin = currentPriceRange.min.toString()
    if (currentPriceRange.max !== Infinity) {
      query.priceMax = currentPriceRange.max.toString()
    }
  }

  // Add search query if present
  if (searchQuery.value) {
    query.q = searchQuery.value
  }
  const _locale = locale.value == "ar-SA" ? "" : locale.value
  // Navigate to search page with query params
  router.push({
    path:  `${_locale}/Packages/search`,
    query
  })
}

// Computed property for selected periods display
const selectedPeriodsDisplay = computed(() => {
  if (!selectedPeriods.value.length) return t('search.any_time')
  return selectedPeriods.value
    .map(id => {
      const period = periods.find(p => p.id === id);
      const localeKey = locale.value.substring(0, 2) as 'en' | 'ar';
      return period?.name[localeKey];
    })
    .filter(Boolean)
    .join(', ')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>