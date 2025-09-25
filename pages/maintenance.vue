<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <Icon name="material-symbols:construction" class="mx-auto h-16 w-16 text-blue-600" />
        <h1 class="mt-6 text-3xl font-bold text-gray-900">الموقع تحت الصيانة</h1>
        <p class="mt-2 text-sm text-gray-600">
          نقوم حالياً بتحديث الموقع لتحسين تجربتك
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-sm text-gray-600">
            سنعود قريباً مع تحسينات جديدة
          </p>
          
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">تواصل معنا</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p>📧 البريد الإلكتروني: info@wonderland.com</p>
              <p>📱 الهاتف: +966 50 123 4567</p>
              <p>💬 الواتساب: +966 50 123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: false,
  middleware: []
})

// SEO
useHead({
  title: 'الموقع تحت الصيانة - Wonder Land',
  meta: [
    { name: 'description', content: 'الموقع تحت الصيانة - سنعود قريباً' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
