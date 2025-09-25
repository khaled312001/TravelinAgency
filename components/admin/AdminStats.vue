<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
    <div 
      v-for="stat in stats" 
      :key="stat.key"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200"
    >
      <div class="flex items-center">
        <div :class="stat.iconBg" class="p-2 sm:p-3 rounded-lg flex-shrink-0">
          <Icon :name="stat.icon" :class="stat.iconColor" class="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div class="mr-3 sm:mr-4 min-w-0 flex-1">
          <p class="text-xs sm:text-sm font-medium text-gray-600 truncate">{{ stat.label }}</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900 truncate">{{ stat.value }}</p>
          <p v-if="stat.subtitle" class="text-xs text-gray-500 truncate">{{ stat.subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>
