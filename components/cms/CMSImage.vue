<template>
  <div class="mb-6">
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      class="rounded-lg shadow-sm object-cover"
      :style="{ width: width + 'px', height: height + 'px' }"
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: '/images/placeholder.jpg'
  },
  alt: {
    type: String,
    default: 'صورة'
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  }
})
</script>
