<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Minimal Test Page</h1>
      <p class="text-gray-600 mb-8">This page has no API calls or complex components</p>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <p class="text-green-600 font-medium">✅ Page loaded successfully!</p>
        <p class="text-sm text-gray-500 mt-2">Timestamp: {{ timestamp }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const timestamp = new Date().toISOString()

definePageMeta({
  layout: false // Use no layout to avoid any layout-related issues
})
</script>
