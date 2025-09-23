<template>
  <div 
    class="relative group"
    @mouseenter="pauseAutoScroll"
    @mouseleave="resumeAutoScroll"
  >
    <!-- Cards Container -->
    <div class="relative w-full">
      <div ref="scrollContainer"
        class="flex overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        :dir="$i18n.locale === 'ar-SA' ? 'rtl' : 'ltr'"
      >
        <div class="flex gap-4 sm:gap-6 md:gap-8 px-4 md:px-6">
          <div v-for="(item, index) in items"
            :key="typeof item === 'object' && 'id' in item ? item.id : index"
            class="flex-none w-[85vw] sm:w-[400px] md:w-[500px] h-[500px] sm:h-[550px] md:h-[600px] snap-start"
            :ref="el => cardRefs[index] = el as HTMLElement"
          >
            <slot :item="item" :index="index" />
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <button 
        @click="scrollToPrev"
        :class="[
          'absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-1.5 sm:p-2 rounded-full shadow-lg z-10 transition-opacity',
          $i18n.locale === 'ar-SA' ? 'right-2 sm:right-4' : 'left-2 sm:left-4',
          'opacity-0 group-hover:opacity-100'
        ]"
      >
        <Icon name="material-symbols:chevron-left-rounded" class="w-4 h-4 sm:w-6 sm:h-6" :class="{ 'rotate-180': $i18n.locale === 'ar-SA' }" />
      </button>
      <button 
        @click="scrollToNext"
        :class="[
          'absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-1.5 sm:p-2 rounded-full shadow-lg z-10 transition-opacity',
          $i18n.locale === 'ar-SA' ? 'left-2 sm:left-4' : 'right-2 sm:right-4',
          'opacity-0 group-hover:opacity-100'
        ]"
      >
        <Icon name="material-symbols:chevron-right-rounded" class="w-4 h-4 sm:w-6 sm:h-6" :class="{ 'rotate-180': $i18n.locale === 'ar-SA' }" />
      </button>
    </div>

    <!-- Pagination Dots -->
    <div class="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
      <button
        v-for="(_, index) in items"
        :key="index"
        @click="scrollToIndex(index)"
        class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300"
        :class="[
          currentIndex === index 
            ? 'bg-primary-600 w-4 sm:w-6' 
            : 'bg-gray-300 hover:bg-primary-400'
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  items: any[]
}>()

const emit = defineEmits<{
  (e: 'change', index: number): void
}>()

const { locale } = useI18n()
const scrollContainer = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const cardRefs = ref<HTMLElement[]>([])
const isScrolling = ref(false)
const autoScrollInterval = ref<NodeJS.Timeout | null>(null)
const isAutoScrollPaused = ref(false)

// Constants
const AUTO_SCROLL_INTERVAL = 2000 // 2 seconds
const SCROLL_ANIMATION_DURATION = 500 // 500ms

// Auto scroll functionality
const startAutoScroll = () => {
  if (autoScrollInterval.value) return
  
  autoScrollInterval.value = setInterval(() => {
    if (!isAutoScrollPaused.value) {
      scrollToNext()
    }
  }, AUTO_SCROLL_INTERVAL)
}

const stopAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}

const pauseAutoScroll = () => {
  isAutoScrollPaused.value = true
}

const resumeAutoScroll = () => {
  isAutoScrollPaused.value = false
}

// Constants for different screen sizes
const getCardWidth = (): number => {
  if (process.client) {
    const width = window.innerWidth
    if (width < 640) return Math.round(width * 0.85) // Mobile: 85vw
    if (width < 768) return 400 // Tablet: 400px
    return 500 // Desktop: 500px
  }
  return 500 // Default for SSR
}

const CARD_GAP = 32

const scrollToIndex = (index: number, smooth = true) => {
  if (!scrollContainer.value) return
  
  const targetCard = cardRefs.value[index]
  if (!targetCard) return

  isScrolling.value = true
  const isRTL = locale.value === 'ar-SA'
  const cardWidth = getCardWidth()
  const containerWidth = scrollContainer.value.clientWidth
  
  // Calculate position that centers the card in the viewport
  const cardOffset = index * (cardWidth + CARD_GAP)
  // Add half of the container width minus half of the card width to center it
  const scrollPosition = cardOffset - (containerWidth - cardWidth) / 2
  
  // Ensure we don't scroll past the beginning
  const adjustedPosition = Math.max(0, scrollPosition)

  scrollContainer.value.scrollTo({
    left: isRTL ? -adjustedPosition : adjustedPosition,
    behavior: smooth ? 'smooth' : 'instant'
  })

  currentIndex.value = index
  emit('change', index)

  setTimeout(() => {
    isScrolling.value = false
  }, smooth ? SCROLL_ANIMATION_DURATION : 0)
}

const scrollToNext = () => {
  const nextIndex = currentIndex.value === props.items.length - 1 
    ? 0 // Go to first if at last
    : currentIndex.value + 1
  scrollToIndex(nextIndex)
}

const scrollToPrev = () => {
  const prevIndex = currentIndex.value === 0
    ? props.items.length - 1 // Go to last if at first
    : currentIndex.value - 1
  scrollToIndex(prevIndex)
}

const updateIndex = () => {
  if (!scrollContainer.value || isScrolling.value) return

  const isRTL = locale.value === 'ar-SA'
  const cardWidth = getCardWidth()
  const scrollPosition = isRTL 
    ? -scrollContainer.value.scrollLeft 
    : scrollContainer.value.scrollLeft
  
  const newIndex = Math.round(scrollPosition / (cardWidth + CARD_GAP))
  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < props.items.length) {
    currentIndex.value = newIndex
    emit('change', newIndex)
  }
}

// Watch scroll position to update current index
onMounted(() => {
  if (!scrollContainer.value) return

  const debouncedUpdate = useDebounceFn(updateIndex, 100)
  scrollContainer.value.addEventListener('scroll', debouncedUpdate)

  // Initial index update
  updateIndex()

  // Start auto-scroll
  startAutoScroll()

  // Cleanup
  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', debouncedUpdate)
    }
    stopAutoScroll()
  })
})

// Watch locale changes to update scroll position
watch(() => locale.value, () => {
  scrollToIndex(currentIndex.value, false)
})

// Watch items length changes
watch(() => props.items.length, (newLength, oldLength) => {
  if (currentIndex.value >= newLength) {
    // If current index is out of bounds, reset to first slide
    scrollToIndex(0, false)
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
