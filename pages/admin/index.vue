<template>
  <div></div>
</template>

<script setup>
// إعادة توجيه تلقائية إلى لوحة التحكم
definePageMeta({
  middleware: 'admin'
})

// إعادة توجيه فورية
await navigateTo('/admin/dashboard')
</script>
