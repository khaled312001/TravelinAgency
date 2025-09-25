<template>
  <select
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">{{ placeholder }}</option>
    <option 
      v-for="option in options" 
      :key="option.value" 
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'اختر...'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])
</script>
