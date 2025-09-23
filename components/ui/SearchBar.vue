<template>
  <form @submit.prevent="handleSearch" class="flex flex-wrap gap-4">
    <div class="flex-1 min-w-[200px]">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('search.destination') }}
      </label>
      <input
        v-model="searchQuery.destination"
        type="text"
        :placeholder="$t('search.destinationPlaceholder')"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>

    <div class="w-full md:w-auto">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('search.dates') }}
      </label>
      <input
        v-model="searchQuery.dates"
        type="date"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>

    <div class="w-full md:w-auto">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('search.travelers') }}
      </label>
      <select
        v-model="searchQuery.travelers"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <option value="1">{{ $t('search.travelerCount', { count: 1 }) }}</option>
        <option value="2">{{ $t('search.travelerCount', { count: 2 }) }}</option>
        <option value="3">{{ $t('search.travelerCount', { count: 3 }) }}</option>
        <option value="4">{{ $t('search.travelerCount', { count: '4+' }) }}</option>
      </select>
    </div>

    <div class="w-full md:w-auto flex items-end">
      <button
        type="submit"
        class="w-full md:w-auto px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {{ $t('search.button') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref({
  destination: '',
  dates: '',
  travelers: '2'
})

const emit = defineEmits(['search'])

function handleSearch() {
  emit('search', searchQuery.value)
}
</script>