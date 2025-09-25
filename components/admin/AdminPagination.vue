<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- معلومات الصفحة -->
    <div class="text-xs sm:text-sm text-gray-700 text-center sm:text-right">
      عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, totalItems) }} من أصل {{ totalItems }} {{ itemName }}
    </div>
    
    <!-- أزرار التنقل -->
    <div class="flex items-center space-x-1 space-x-reverse">
      <button
        @click="$emit('update:currentPage', Math.max(1, currentPage - 1))"
        :disabled="currentPage === 1"
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        السابق
      </button>
      
      <!-- أرقام الصفحات -->
      <div class="flex items-center space-x-1 space-x-reverse">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('update:currentPage', page)"
          :class="[
            'px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md transition-colors',
            page === currentPage 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="$emit('update:currentPage', Math.min(totalPages, currentPage + 1))"
        :disabled="currentPage === totalPages"
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  itemName: {
    type: String,
    default: 'عنصر'
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

// Emits
const emit = defineEmits(['update:currentPage'])

// Computed
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
