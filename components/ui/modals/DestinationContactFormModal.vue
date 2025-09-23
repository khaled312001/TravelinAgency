<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 overflow-y-auto py-6">
    <div 
      class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 max-h-[min(calc(100vh-2rem),42.7rem)] my-6 mt-14 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
      @click.stop
    >
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        type="button"
      >
        <Icon name="material-symbols:close" class="w-6 h-6" />
        <span class="sr-only">{{ t('common.close') }}</span>
      </button>

      <!-- Success Message -->
      <div v-if="formSubmitted" class="flex flex-col items-center justify-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="material-symbols:check" class="w-10 h-10 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('home.destinations.destination_form.success_title') }}</h3>
        <p class="text-gray-600 text-center mb-4">
          {{ t('home.destinations.destination_form.success_message', { name: destinationName }) }}
        </p>
        <NotificationStatus 
          :sent="notificationSent" 
          :error="notificationError" 
          :failed="notificationFailed" 
        />
        <button 
          @click="$emit('close')" 
          class="mt-6 rounded-xl bg-primary px-8 py-3 text-white hover:bg-primary-dark transition-colors"
        >
          {{ t('common.close') }}
        </button>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-8 mt-4">
          <h2 class="text-2xl font-bold mb-3 text-gray-900">
            {{ t('home.destinations.destination_form.title', { name: destinationName }) }}
          </h2>
          <p class="text-gray-600">
            {{ t('home.destinations.destination_form.description', { name: destinationName }) }}
          </p>
          <!-- Response Time Note -->
          <div class="mt-4 p-4 bg-primary/5 rounded-xl text-sm text-gray-600 flex items-start gap-2">
            <Icon name="material-symbols:schedule" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>{{ t('home.destinations.destination_form.response_time') }}</p>
          </div>
          <div class="mt-4 p-4 bg-primary/5 rounded-xl text-sm text-gray-600 flex items-start gap-2">
            <Icon name="material-symbols:lightbulb-outline" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>{{ t('home.destinations.destination_form.custom_package_note') }}</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right">
              {{ t('home.destinations.destination_form.name') }}
            </label>
            <div class="relative">
              <Icon name="material-symbols:person-outline" class="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 ltr:pl-12 rtl:pr-12 rounded-xl border focus:ring-2 focus:ring-primary transition-colors',
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                ]"
                :placeholder="t('home.destinations.destination_form.name_placeholder')"
                @blur="validateField('name')"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-500 ltr:text-left rtl:text-right">{{ errors.name }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right">
              {{ t('home.destinations.destination_form.phone') }}
            </label>
            <div class="relative">
              <Icon name="material-symbols:call-outline" class="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone"
                v-model="form.phone"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 ltr:pl-12 rtl:pr-12 rounded-xl border focus:ring-2 focus:ring-primary transition-colors',
                  errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                ]"
                :placeholder="t('home.destinations.destination_form.phone_placeholder')"
                @blur="validateField('phone')"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500 ltr:text-left rtl:text-right">{{ errors.phone }}</p>
          </div>

          <!-- Email (Optional) -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right">
              {{ t('home.destinations.destination_form.email') }}
            </label>
            <div class="relative">
              <Icon name="material-symbols:mail-outline" class="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                v-model="form.email"
                type="text"
                :class="[
                  'w-full px-4 py-3 ltr:pl-12 rtl:pr-12 rounded-xl border focus:ring-2 focus:ring-primary transition-colors'
                ]"
                :placeholder="t('home.destinations.destination_form.email_placeholder')"
              />
            </div>
          </div>

          <!-- Details (Optional) -->
          <div>
            <label for="details" class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right">
              {{ t('home.destinations.destination_form.request_details') }}
            </label>
            <div class="relative">
              <Icon name="material-symbols:chat-outline" class="absolute ltr:left-4 rtl:right-4 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="details"
                v-model="form.details"
                rows="4"
                class="w-full px-4 py-3 ltr:pl-12 rtl:pr-12 rounded-xl border focus:ring-2 focus:ring-primary transition-colors resize-none"
                :placeholder="t('home.destinations.destination_form.request_details_placeholder')"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full rounded-xl bg-primary px-6 py-3.5 text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
            :disabled="isSubmitting || hasErrors"
            :class="{ 'opacity-70 cursor-not-allowed': isSubmitting || hasErrors }"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            {{ t(isSubmitting ? 'common.sending' : 'home.destinations.destination_form.submit') }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { NotificationResult, DestinationInquiry } from '~/types/whatsapp'

const { t } = useI18n()
const { sendDestinationNotification } = useWhatsApp()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: typeof form): void
}>()

const props = defineProps<{
  destinationName: string
}>()

const isSubmitting = ref(false)
const formSubmitted = ref(false)
const notificationSent = ref(false)
const notificationError = ref('')
const notificationFailed = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  details: '',
  destinationName: props.destinationName
})

// Form validation
const errors = reactive({
  name: '',
  phone: '',
  email: '',
  details: ''
})

const hasErrors = computed(() => {
  const requiredFields = ['name', 'phone']
  return Object.entries(errors).some(([key, error]) => error !== '') ||
         requiredFields.some(field => !form[field as keyof typeof form])
})

function validatePhone(phone: string): boolean {
  // Basic validation for international phone numbers
  const re = /^\+?[0-9\s\-()]{8,20}$/
  return re.test(String(phone))
}

function validateField(field: keyof typeof form) {
  switch (field) {
    case 'name':
      if (!form.name) {
        errors.name = t('home.destinations.destination_form.name_required')
      } else if (form.name.length < 2) {
        errors.name = t('home.destinations.destination_form.name_too_short')
      } else {
        errors.name = ''
      }
      break
    case 'phone':
      if (!form.phone) {
        errors.phone = t('home.destinations.destination_form.phone_required')
      } else if (!validatePhone(form.phone)) {
        errors.phone = t('home.destinations.destination_form.phone_invalid')
      } else {
        errors.phone = ''
      }
      break
    case 'email':
    case 'details':
      errors[field] = ''
      break
  }
}

function validateForm(): boolean {
  validateField('name')
  validateField('phone')
  
  return Object.values(errors).every(error => error === '') &&
         ['name', 'phone'].every(field => form[field as keyof typeof form])
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    
    // Send the form data to the WhatsApp notification API
    const result = await sendDestinationNotification({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.details,
      destinationName: props.destinationName
    })

    // Update notification status
    notificationSent.value = result.success
    notificationError.value = result.error || ''
    notificationFailed.value = !result.success && !result.error
    
    // Show success message
    formSubmitted.value = true
    
    // Emit the form data
    emit('submit', { ...form })
  } catch (error) {
    console.error('Failed to submit form:', error)
    notificationSent.value = false
    notificationFailed.value = true
    notificationError.value = t('home.destinations.destination_form.error_message')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
/* Custom Scrollbar Styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>