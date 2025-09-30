<template>
  <section class="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
    <!-- Video Background with fallback -->
    <div class="absolute inset-0 z-0">
      <!-- Desktop Video -->
      <video 
        ref="videoRef" 
        preload="auto" 
        autoplay 
        loop 
        muted 
        playsinline 
        class="hidden md:block w-full h-full object-cover video-element"
        poster="/images/home/heroSection/hero-image.webp"
        key="desktop-video"
      >
        <source src="/videos/hero/desktop/hero-desktop.webm" type="video/webm">
        <source src="/videos/hero/desktop/hero-desktop.mp4" type="video/mp4">
      </video>

      <!-- Mobile Video -->
      <video 
        autoplay 
        loop 
        muted 
        playsinline 
        preload="auto" 
        class="md:hidden w-full h-full object-cover video-element"
        poster="/images/home/heroSection/hero-image.webp"
        key="mobile-video"
      >
        <source src="/videos/hero/mobile/hero-mobile-center.webm" type="video/webm">
        <source src="/videos/hero/mobile/hero-mobile-center.mp4" type="video/mp4">
      </video>

      <!-- Gradient Overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-b from-black/20"
      ></div>
    </div>

    <!-- Content -->
    <div 
      class="relative z-10 container"
    >
      <!-- Main Heading with Sliding Text -->
      <h1 class="text-3xl text-capitalize sm:text-7xl md:text-7xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.2] md:leading-[1.1] text-wrap:balance mx-auto w-full text-center text-shadow min-h-[6em] sm:min-h-[4em] md:min-h-[3.3em] flex items-center justify-center">
        <div class="w-full flex items-center justify-center">
          <div class="w-[80%] sm:w-[85%] md:w-[90%]">
            <SlideText 
              :phrases="heroTitlePhrases"
              textColor="white"
              fontWeight="inherit"
              :transitionDelay="3000"
            />
          </div>
        </div>
      </h1>

      <!-- Animated Subheading -->
      <p 
        class="text-2xl text-white mb-10 max-w-4xl font-bold mx-auto tracking-wide leading-relaxed [text-wrap:balance]"
      >
        {{ $t('home.hero.subtitle') }}
      </p>

      <!-- Animated CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          @click="scrollToPackages"
          class="bg-primary-500 outline-none hover:bg-primary-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_4px_30px_rgba(255,255,255,0.25)] active:scale-105"
        >
          {{ $t('home.hero.cta') }}
        </button>
        
        <button
          @click="scrollToSearch"
          class="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-white/30 active:scale-105"
        >
          {{ $t('home.hero.search_cta') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import SlideText from '~/components/ui/SlideText.vue'

const { t, locale } = useI18n()
const emit = defineEmits<{
  (e: 'scroll-to-packages'): void
  (e: 'scroll-to-search'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

// Create an array of phrases for the sliding text effect
const heroTitlePhrases = computed(() => {
  // Base title from i18n
  const baseTitle = t('home.hero.title')
  
  // Additional phrases that will morph with the base title
  // These should be translated or dynamically generated based on your needs
  if (locale.value === 'ar-SA') {
    return [
      baseTitle,
      'اكتشف عالماً من المغامرات',
      'تجارب لا تُنسى تنتظرك'
    ]
  } else {
    return [
      baseTitle,
      'Discover a World of Adventures',
      'Unforgettable Experiences Await'
    ]
  }
})

// Intersection Observer for video optimization
onMounted(() => {
  if (videoRef.value) {
    const { stop } = useIntersectionObserver(
      videoRef,
      ([{ isIntersecting }]) => {
        if (videoRef.value) {
          if (isIntersecting) {
            // Handle play promise to prevent uncaught errors
            const playPromise = videoRef.value.play()
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                // Auto-play was prevented, ignore the error
                console.log('Video autoplay prevented:', error)
              })
            }
          } else {
            videoRef.value.pause()
          }
        }
      }
    )
  }
})

const scrollToPackages = () => {
  emit('scroll-to-packages')
}

const scrollToSearch = () => {
  emit('scroll-to-search')
}
</script>

<style>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* Ensure smooth font rendering */
h1,
p {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Video element styling to prevent extension interference */
.video-element {
  /* Prevent browser extensions from modifying video elements */
  isolation: isolate;
  contain: layout style paint;
  pointer-events: none;
}

/* Ensure consistent video rendering */
.video-element:not([class*="js-parse"]) {
  /* Apply styles only to unmodified video elements */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  /* Mobile-specific adjustments */
}

@media (max-width: 480px) {
  /* Small mobile adjustments */
}
</style>