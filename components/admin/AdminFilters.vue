<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      <slot>
        <!-- Default filter slots will be inserted here -->
      </slot>
    </div>
  </div>
</template>

<script setup>
// This component provides a responsive container for filters
// Individual filter components should be passed as slots
</script>
