<template>
  <div class="relative">
    <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
    <input
      :model-value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full pr-8 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'البحث...'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])
</script>
