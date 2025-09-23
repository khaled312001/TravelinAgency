<template>
  <p
    :style="{ color: color }"
    class="text-gray-700 leading-relaxed mb-4"
  >
    {{ text }}
  </p>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'هذا نص فقرة جديد...'
  },
  color: {
    type: String,
    default: '#374151'
  }
})
</script>
