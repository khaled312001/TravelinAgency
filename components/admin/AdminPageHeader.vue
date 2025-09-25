<template>
  <div class="flex flex-col space-y-4">
    <!-- العنوان والوصف -->
    <div>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-gray-600">{{ description }}</p>
    </div>
    
    <!-- الأزرار -->
    <div v-if="$slots.actions" class="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>
