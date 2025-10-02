<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-green-600 mb-4">✅ Vercel Deployment Working!</h1>
      <p class="text-gray-600 mb-4">This page loads without any API calls or middleware.</p>
      <NuxtLink to="/" class="text-blue-600 hover:underline">← Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Simple test page with no API calls or middleware
useHead({
  title: 'Test Page - Vercel Deployment'
})
</script>

