<template>
  <button @click="$emit('click')" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
    <Icon name="material-symbols:close" class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
defineEmits(['click'])
</script>
