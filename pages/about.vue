<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير متاحة</h2>
      <p class="text-gray-600 mb-8">هذه الصفحة معطلة حالياً</p>
      <NuxtLink 
        to="/" 
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        العودة للرئيسية
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Check if about page is published
try {
  // Use API to check page status instead of reading file directly
  const pageStatus = await $fetch('/api/pages/check-access?path=/about/')
  if (!pageStatus.accessible) {
    // Page is disabled, show 404 content
    useHead({
      title: '404 - الصفحة غير متاحة',
      meta: [
        { name: 'description', content: 'هذه الصفحة معطلة حالياً' }
      ]
    })
  } else {
    // Page is published, redirect to actual about page
    await navigateTo('/about-published')
  }
} catch (error) {
  // If API check fails, show 404 content
  console.warn('Could not check page status, showing 404:', error)
  useHead({
    title: '404 - الصفحة غير متاحة',
    meta: [
      { name: 'description', content: 'هذه الصفحة معطلة حالياً' }
    ]
  })
}
</script>