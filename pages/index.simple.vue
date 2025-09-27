<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Travel Agency
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Welcome to our travel agency website
      </p>
      <div class="space-y-4">
        <a 
          href="/api/test" 
          class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test API
        </a>
        <a 
          href="/api/simple" 
          class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Simple API
        </a>
        <a 
          href="/api/debug" 
          class="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Debug Info
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple page with no complex dependencies
definePageMeta({
  layout: false
})

useHead({
  title: 'Travel Agency - Home',
  meta: [
    { name: 'description', content: 'Welcome to our travel agency' }
  ]
})
</script>
