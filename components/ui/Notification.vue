<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- أيقونة النجاح -->
            <Icon
              v-if="type === 'success'"
              name="material-symbols:check-circle"
              class="h-6 w-6 text-green-400"
            />
            <!-- أيقونة الخطأ -->
            <Icon
              v-else-if="type === 'error'"
              name="material-symbols:error"
              class="h-6 w-6 text-red-400"
            />
            <!-- أيقونة التحذير -->
            <Icon
              v-else-if="type === 'warning'"
              name="material-symbols:warning"
              class="h-6 w-6 text-yellow-400"
            />
            <!-- أيقونة المعلومات -->
            <Icon
              v-else
              name="material-symbols:info"
              class="h-6 w-6 text-blue-400"
            />
          </div>
          <div class="mr-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm text-gray-500">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              @click="close"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">إغلاق</span>
              <Icon name="material-symbols:close" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const show = ref(true)

const close = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

// إغلاق تلقائي بعد المدة المحددة
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>
