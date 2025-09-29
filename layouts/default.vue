<template>
  <div>
    <DirectionHandler />
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-4 sticky top-0">
        <div class="flex items-center justify-between">
          <NuxtLink :to="localpath('/')" class="flex items-center">
            <NuxtImg 
              :src="siteLogo" 
              class="h-[48px]"
              :alt="siteName + ' Logo'" 
              loading="eager"
            />
            <span class="font-bold text-lg font-italic text-primary-900">{{ siteName }}</span>
          </NuxtLink>
          
          <div class="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <NuxtLink 
              v-for="(item, index) in navItems" 
              :key="index"
              :to="localpath(item.to)"
              :class="[
                'transition-colors',
                $route.path == localpath(item.to) ? 'text-primary-900 font-medium' : 'text-gray-600 hover:text-primary'
              ]"
            >
              {{ $t(item.label) }}
            </NuxtLink>
            <!-- Language Switcher -->
            <button
              @click.prevent.stop="toggleLanguage"
              class="px-3 py-1 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {{ currentLocale === 'en-US' ? 'العربية' : 'English' }}
            </button>
          </div>
          <!-- Mobile Menu Button -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden text-gray-600 hover:text-primary"
          >
            <span class="sr-only">Menu</span>
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <!-- Mobile Menu -->
        <div
          v-show="isMenuOpen"
          class="md:hidden mt-4 space-y-4"
        >
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="index"
            :to="localpath(item.to)"
            :class="[
              'block transition-colors',
              $route.path == localpath(item.to) ? 'text-primary-900 font-medium' : 'text-gray-600 hover:text-primary'
            ]"
            @click="isMenuOpen = false"
          >
            {{ $t(item.label) }}
          </NuxtLink>
          <button
            @click="toggleLanguage"
            class="w-full text-left px-3 py-1 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            {{ currentLocale === 'en-US' ? 'العربية' : 'English' }}
          </button>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
    <AppFooter />
    <FloatingButtons />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppFooter from '~/components/layout/AppFooter.vue';
import FloatingButtons from '~/components/ui/FloatingButtons.vue';
const { locale } = useI18n()
const localpath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = computed(() => locale.value)
const isMenuOpen = ref(false)
const isTransitioning = ref(false)
const { startLocaleTransition } = useViewTransition()

// Load site settings
const { loadSettings, getSetting, settings } = useSettings()
const siteSettings = ref({})

// Computed properties for site settings
const siteLogo = computed(() => {
  const logo = getSetting('site_logo')
  console.log('Current site logo:', logo)
  return logo || '/images/home/logo/WonderlandLogo.svg'
})

const siteName = computed(() => {
  const name = getSetting('site_name_ar') || getSetting('site_name_en')
  console.log('Current site name:', name)
  return name || 'Wonder Land'
})

// Load settings on mount
onMounted(async () => {
  try {
    console.log('Loading settings in layout...')
    await loadSettings(true) // Load public settings only
    console.log('Settings loaded in layout:', settings.value)
  } catch (error) {
    console.error('Failed to load site settings:', error)
  }
})

// Listen for settings updates
onMounted(() => {
  // Listen for custom event to refresh settings
  window.addEventListener('settings-updated', async () => {
    try {
      console.log('Settings update event received in layout')
      await loadSettings(true)
      console.log('Settings refreshed in layout')
    } catch (error) {
      console.error('Failed to refresh site settings:', error)
    }
  })
  
  // Also listen for storage events (for cross-tab updates)
  window.addEventListener('storage', (e) => {
    if (e.key === 'settings-updated') {
      console.log('Settings storage event received in layout')
      loadSettings(true)
    }
  })
})

// Dynamic navigation items based on page status
const navItems = ref([
  { to: '/', label: 'nav.home', id: 1 },
  { to: '/packages', label: 'nav.packages', id: 2 },
  { to: '/custom-package', label: 'nav.custom_package', id: 3 },
  { to: '/about', label: 'nav.about', id: 4 },
  // { to: '/contact', label: 'nav.contact' }
])

// Load navigation items based on page status
const loadNavigationItems = async () => {
  try {
    const response = await $fetch('/api/public/navigation')
    if (response.success && response.data && response.data.menus && response.data.menus.main) {
      // Filter only published pages
      const publishedPages = response.data.menus.main.filter(item => item.page_status === 'published')
      navItems.value = publishedPages.map(item => ({
        to: item.url,
        label: `nav.${item.page_slug || 'home'}`,
        id: item.page_id
      }))
    }
  } catch (error) {
    // Fallback to default navigation if API fails
    console.warn('Could not load navigation from API, using default:', error)
    // Keep the default navItems as fallback
  }
}

// Load navigation on mount
onMounted(() => {
  loadNavigationItems()
})

// Use enhanced direction-aware view transition for language switching
const toggleLanguage = async () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  const currentLocaleValue = locale.value
  const targetLocale = currentLocaleValue === 'ar-SA' ? 'en-US' : 'ar-SA'
  
  try {
    // Use the enhanced direction-aware locale transition
    await startLocaleTransition(
      async () => {
        // Set locale client-side
        locale.value = targetLocale
        
        // Wait for locale to fully apply
        await nextTick()
        
        // Update URL without reload using history API - only on client side
        if (process.client) {
          const path = switchLocalePath(targetLocale)
          window.history.replaceState(null, '', path)
        }
      },
      currentLocaleValue,  // From locale
      targetLocale        // To locale
    )
  } finally {
    // Always reset the transitioning state
    isTransitioning.value = false
  }
}
</script>

<style>
.router-link-active {
  color: var(--color-primary);
  font-weight: 500;
}

/* View Transitions */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-*),
::view-transition-new(package-*) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-image-*),
::view-transition-new(package-image-*) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-content-*),
::view-transition-new(package-content-*) {
  animation: none;
  mix-blend-mode: normal;
}

/* Language transition - specialized for locale changes */
.locale-transitioning {
  pointer-events: none;
}

/* Different opacity levels for main content vs. navigation elements */
.locale-transitioning header,
.locale-transitioning footer {
  transition: opacity 300ms;
  opacity: 0.8;
  will-change: opacity;
}

.locale-transitioning main {
  transition: all 300ms;
  will-change: transform, opacity;
}

/* Direction-specific transitions - these are now handled in transitions.css */
/* RTL support for view transitions */
:root[dir="rtl"] {
  ::view-transition-old(*) {
    animation-direction: reverse;
  }
  ::view-transition-new(*) {
    animation-direction: reverse;
  }
}

/* Only apply these page transitions for page navigation, not language switches */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* RTL transitions */
:root[dir="rtl"] {
  .page-enter-from {
    transform: translateX(-20px);
  }
  .page-leave-to {
    transform: translateX(20px);
  }
}

html.locale-transitioning main {
  view-transition-name: locale-main;
}
</style>