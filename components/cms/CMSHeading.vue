<template>
  <component
    :is="level"
    :style="{ color: color }"
    class="font-bold text-gray-900 mb-4"
    :class="{
      'text-4xl': level === 'h1',
      'text-3xl': level === 'h2',
      'text-2xl': level === 'h3',
      'text-xl': level === 'h4'
    }"
  >
    {{ text }}
  </component>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'عنوان جديد'
  },
  level: {
    type: String,
    default: 'h2',
    validator: (value) => ['h1', 'h2', 'h3', 'h4'].includes(value)
  },
  color: {
    type: String,
    default: '#1f2937'
  }
})
</script>
