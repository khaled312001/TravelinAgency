<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <Icon name="material-symbols:cleaning-services" class="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Service Worker Cleanup</h1>
        <p class="text-gray-600">This page will remove all cached service workers and clear browser cache.</p>
      </div>
      
      <div v-if="!cleanupComplete" class="space-y-4">
        <button
          @click="startCleanup"
          :disabled="isCleaning"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isCleaning ? 'Cleaning...' : 'Start Cleanup' }}
        </button>
        
        <div v-if="isCleaning" class="text-sm text-gray-600">
          <p>Cleaning up service workers and cache...</p>
          <div class="mt-2 space-y-1">
            <p v-if="steps.unregistering">✓ Unregistering service workers</p>
            <p v-if="steps.clearingCache">✓ Clearing browser cache</p>
            <p v-if="steps.clearingStorage">✓ Clearing local storage</p>
            <p v-if="steps.redirecting">✓ Preparing redirect</p>
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div class="text-green-600">
          <Icon name="material-symbols:check-circle" class="h-12 w-12 mx-auto mb-2" />
          <p class="font-semibold">Cleanup Complete!</p>
        </div>
        <p class="text-sm text-gray-600">All service workers have been removed and cache cleared.</p>
        <button
          @click="redirectToHome"
          class="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const isCleaning = ref(false)
const cleanupComplete = ref(false)
const steps = ref({
  unregistering: false,
  clearingCache: false,
  clearingStorage: false,
  redirecting: false
})

const startCleanup = async () => {
  isCleaning.value = true
  
  try {
    // Step 1: Unregister service workers
    steps.value.unregistering = true
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('Service Worker unregistered:', registration)
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 2: Clear caches
    steps.value.clearingCache = true
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 3: Clear storage
    steps.value.clearingStorage = true
    if ('localStorage' in window) {
      localStorage.clear()
    }
    if ('sessionStorage' in window) {
      sessionStorage.clear()
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 4: Prepare redirect
    steps.value.redirecting = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    cleanupComplete.value = true
    
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

const redirectToHome = () => {
  window.location.href = '/'
}
</script>
