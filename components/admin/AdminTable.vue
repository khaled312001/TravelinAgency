<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ التحميل...</span>
    </div>

    <!-- جدول سطح المكتب -->
    <div v-else-if="items.length > 0" class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
            <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              <slot :name="`column-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                {{ getNestedValue(item, column.key) }}
              </slot>
            </td>
            <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button
                    v-for="action in actions"
                    :key="action.key"
                    @click="action.handler(item)"
                    :class="action.class"
                    class="p-1 rounded"
                    :title="action.title"
                  >
                    <Icon :name="action.icon" class="h-4 w-4" />
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- بطاقات الجوال -->
    <div v-else-if="items.length > 0" class="md:hidden divide-y divide-gray-200">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="space-y-3">
          <!-- المحتوى الرئيسي -->
          <div v-for="column in columns" :key="column.key" class="flex justify-between items-start">
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 mb-1">{{ column.label }}</p>
              <div class="text-sm text-gray-900">
                <slot :name="`column-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                  {{ getNestedValue(item, column.key) }}
                </slot>
              </div>
            </div>
          </div>

          <!-- الإجراءات -->
          <div v-if="actions" class="flex items-center justify-end space-x-2 space-x-reverse pt-2 border-t border-gray-100">
            <slot name="actions" :item="item">
              <button
                v-for="action in actions"
                :key="action.key"
                @click="action.handler(item)"
                :class="action.class"
                class="p-2 rounded-lg text-sm font-medium"
                :title="action.title"
              >
                <Icon :name="action.icon" class="h-4 w-4 ml-1" />
                {{ action.label }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else class="text-center py-12">
      <Icon :name="emptyIcon" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ emptyTitle }}</h3>
      <p class="text-gray-500 mb-6">{{ emptyDescription }}</p>
      <slot name="empty-actions">
        <button
          v-if="emptyAction"
          @click="emptyAction.handler"
          :class="emptyAction.class"
          class="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
        >
          <Icon :name="emptyAction.icon" class="h-5 w-5 ml-2" />
          {{ emptyAction.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyIcon: {
    type: String,
    default: 'material-symbols:inbox'
  },
  emptyTitle: {
    type: String,
    default: 'لا توجد بيانات'
  },
  emptyDescription: {
    type: String,
    default: 'لم يتم العثور على أي بيانات'
  },
  emptyAction: {
    type: Object,
    default: null
  }
})

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
</script>
