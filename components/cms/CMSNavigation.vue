<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img
              v-if="getSetting('general', 'site_logo')"
              :src="getSetting('general', 'site_logo')"
              :alt="getSetting('general', 'site_name', 'Wonder Land')"
              class="h-10 w-auto"
            />
            <div v-else class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="material-symbols:travel" class="h-6 w-6 text-white" />
            </div>
            <span class="mr-3 text-xl font-bold text-gray-900">
              {{ getSetting('general', 'site_name', 'Wonder Land') }}
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8 space-x-reverse">
          <NuxtLink
            v-for="item in mainMenu"
            :key="item.id"
            :to="item.url"
            :target="item.target"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            {{ item.title }}
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Icon name="material-symbols:menu" class="h-6 w-6" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-200 py-4"
      >
        <div class="space-y-2">
          <NuxtLink
            v-for="item in mainMenu"
            :key="item.id"
            :to="item.url"
            :target="item.target"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            {{ item.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const { getMenu, loadNavigation } = useCMS()

// State
const mobileMenuOpen = ref(false)

// Function to check if page is published
const isPagePublished = async (pageId) => {
  try {
    const response = await $fetch('/api/pages/check-access', {
      query: { path: getPagePath(pageId) }
    })
    return response.accessible
  } catch (error) {
    return true // Default to showing if check fails
  }
}

// Get page path from ID
const getPagePath = (pageId) => {
  const paths = {
    1: '/',
    2: '/packages/',
    3: '/custom-package/',
    4: '/about/'
  }
  return paths[pageId] || '/'
}

// State for page statuses
const pageStatuses = ref({})

// Load page statuses
const loadPageStatuses = async () => {
  try {
    const paths = ['/', '/packages/', '/custom-package/', '/about/']
    for (const path of paths) {
      const response = await $fetch('/api/pages/check-access', {
        query: { path }
      })
      const pageId = getPageIdFromPath(path)
      pageStatuses.value[pageId] = response.accessible
    }
  } catch (error) {
    console.log('Error loading page statuses:', error)
  }
}

// Get page ID from path
const getPageIdFromPath = (path) => {
  const pathToId = {
    '/': 1,
    '/packages/': 2,
    '/custom-package/': 3,
    '/about/': 4
  }
  return pathToId[path] || 1
}

// Computed - filter out unpublished pages
const mainMenu = computed(() => {
  const menu = getMenu('main')
  if (!menu || !Array.isArray(menu)) return []
  
  // Simple filter - only show published pages
  return menu.filter(item => {
    // Check if page is published
    return item.page_status === 'published'
  })
})

// Force refresh navigation
const forceRefresh = async () => {
  await loadNavigation('main')
  await loadPageStatuses()
}

// Load navigation on mount
onMounted(async () => {
  await forceRefresh()
})

// Watch for page visibility changes and reload navigation
const route = useRoute()
watch(() => route.path, async () => {
  // Reload navigation when route changes to ensure fresh data
  await forceRefresh()
}, { immediate: false })

// Listen for navigation refresh events
const { listenForNavigationRefresh } = useNavigationRefresh()
onMounted(() => {
  listenForNavigationRefresh()
  
  // Also listen for custom navigation refresh events
  if (process.client) {
    window.addEventListener('navigation-refresh', async () => {
      await forceRefresh()
    })
  }
})
</script>
