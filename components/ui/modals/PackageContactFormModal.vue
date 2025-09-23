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
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('packages.details.package_contact_form.success_title') }}</h3>
        <p class="text-gray-600 text-center mb-4">{{ t('packages.details.package_contact_form.success_message') }}</p>
        <NotificationStatus :sent="notificationSent" :error="notificationError" />
        <button 
          @click="$emit('close')" 
          class="mt-6 rounded-xl bg-primary px-8 py-3 text-white hover:bg-primary-dark transition-colors"
        >
          {{ t('common.close') }}
        </button>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-8 mt-8">
          <h2 class="text-2xl font-bold mb-3 text-gray-900">
            {{ t('packages.details.package_contact_form.title', { name: packageName }) }}
          </h2>
          <p class="text-gray-600">
            {{ t('packages.details.package_contact_form.description', { name: packageName }) }}
          </p>
          <!-- Response Time Note -->
          <div class="mt-4 p-4 bg-primary/5 rounded-xl text-sm text-gray-600 flex items-start gap-2">
            <Icon name="material-symbols:schedule" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>{{ t('packages.details.package_contact_form.response_time') }}</p>
          </div>
          <div class="mt-4 p-4 bg-primary/5 rounded-xl text-sm text-gray-600 flex items-start gap-2">
            <Icon name="material-symbols:lightbulb-outline" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>{{ t('packages.details.package_contact_form.custom_package_note') }}</p>
          </div>
        </div>

        <!-- Contact Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right" for="name">
              {{ t('packages.details.package_contact_form.name') }} 
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
                :placeholder="t('packages.details.package_contact_form.name_placeholder')"
                @blur="validateField('name')"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-500 ltr:text-left rtl:text-right">{{ errors.name }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right" for="phone">
              {{ t('packages.details.package_contact_form.phone') }} 
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
                :placeholder="t('packages.details.package_contact_form.phone_placeholder')"
                @blur="validateField('phone')"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500 ltr:text-left rtl:text-right">{{ errors.phone }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right" for="email">
              {{ t('packages.details.package_contact_form.email') }}
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
                :placeholder="t('packages.details.package_contact_form.email_placeholder')"
              />
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 ltr:text-left rtl:text-right" for="message">
              {{ t('packages.details.package_contact_form.request_details') }}
            </label>
            <div class="relative">
              <Icon name="material-symbols:chat-outline" class="absolute ltr:left-4 rtl:right-4 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                class="w-full px-4 py-3 ltr:pl-12 rtl:pr-12 rounded-xl border focus:ring-2 focus:ring-primary transition-colors resize-none"
                :placeholder="t('packages.details.package_contact_form.request_details_placeholder')"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full rounded-xl bg-primary px-8 py-3 text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="submitting || !isFormValid"
          >
            <span v-if="!submitting">{{ t('packages.details.package_contact_form.submit') }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              {{ t('common.loading') }}
            </span>
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Package } from '~/composables/usePackages'

const props = defineProps<{
  package_: Package
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { sendPackageNotification } = useWhatsApp()
const submitting = ref(false)
const formSubmitted = ref(false)
const notificationSent = ref(false)
const notificationError = ref('')
const packageName = computed(() => {
  const key = `title_${useI18n().locale.value.slice(0, 2)}` as keyof Package
  return props.package_[key] as string
})

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const form = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const errors = ref<Record<keyof FormData, string>>({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const validatePhone = (phone: string): boolean => {
  // Basic phone validation - can be enhanced based on requirements
  const re = /^[+]?[\d\s-]{8,}$/
  return re.test(phone)
}

const validateField = (field: keyof FormData) => {
  errors.value[field] = ''

  // Only validate required fields (name and phone)
  if (field === 'name' || field === 'phone') {
    if (!form.value[field]) {
      errors.value[field] = t('validation.required')
      return false
    }
  }

  switch (field) {
    case 'phone':
      if (!validatePhone(form.value.phone)) {
        errors.value.phone = t('validation.invalid_phone')
        return false
      }
      break
  }

  return true
}

const validateForm = (): boolean => {
  let isValid = true;
  // Only validate required fields
  ['name', 'phone'].forEach((field) => {
    if (!validateField(field as keyof FormData)) {
      isValid = false
    }
  })
  return isValid
}

const isFormValid = computed(() => {
  // Only check required fields (name and phone)
  return form.value.name.length > 0 && 
         form.value.phone.length > 0 && 
         validatePhone(form.value.phone) &&
         Object.values(errors.value).every(error => error === '')
})

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    // Send the form data to the WhatsApp notification API
    const result = await sendPackageNotification({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      message: form.value.message,
      packageId: props.package_.id,
      packageName: packageName.value
    }) as NotificationResult

    // Update notification status
    notificationSent.value = result.success
    notificationError.value = result.error || ''
    
    // Show success message
    formSubmitted.value = true
  } catch (error) {
    console.error('Failed to submit form:', error)
    notificationSent.value = false
    notificationError.value = t('packages.details.package_contact_form.error_message')
  } finally {
    submitting.value = false
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
  background: #888;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
