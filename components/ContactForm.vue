<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300" 
         :class="{ 'scale-100 opacity-100': modelValue, 'scale-95 opacity-0': !modelValue }"
         @click.stop>
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">{{ t('contact.title') }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ t('contact.description') }} <span class="text-primary font-medium">{{ t('contact.free') }}</span></p>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
      
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name Field -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">{{ t('contact.form.fullName.label') }}</label>
            <input
              v-model="form.fullName"
              type="text"
              id="fullName"
              required
              :placeholder="t('contact.form.fullName.placeholder')"
              class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-gray-400 outline-none text-gray-700 text-sm"
            />
          </div>
          
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ t('contact.form.email.label') }}</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              :placeholder="t('contact.form.email.placeholder')"
              class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-gray-400 outline-none text-gray-700 text-sm"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': validationErrors.email }"
            />
            <p v-if="validationErrors.email" class="mt-1 text-red-500 text-xs">{{ validationErrors.email }}</p>
          </div>

          <!-- Phone Field -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">{{ t('contact.form.phone.label') }}</label>
            <div class="flex gap-2">
              <select
                v-model="form.countryCode"
                class="px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none text-gray-700 text-sm min-w-[80px]"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': validationErrors.phone }"
              >
                <option v-for="country in countries" :key="country.key" :value="country.code">
                  {{ country.code }}
                </option>
              </select>
              <input
                v-model="form.phone"
                type="tel"
                id="phone"
                required
                :placeholder="countries.find(c => c.code === form.countryCode)?.example"
                class="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-gray-400 outline-none text-gray-700 text-sm"
                :class="{ 'text-right': $i18n.locale === 'ar', 'border-red-500 focus:border-red-500 focus:ring-red-500': validationErrors.phone }"
                pattern="[0-9]*"
                inputmode="numeric"
                @input="handlePhoneInput"
              />
            </div>
            <p v-if="validationErrors.phone" class="mt-1 text-red-500 text-xs">{{ validationErrors.phone }}</p>
          </div>

          <!-- Message Field -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">{{ t('contact.form.message.label') }}</label>
            <textarea
              v-model="form.message"
              id="message"
              rows="3"
              required
              :placeholder="t('contact.form.message.placeholder')"
              class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-gray-400 outline-none text-gray-700 text-sm resize-none"
            ></textarea>
          </div>

                 <!-- Success Message -->
                 <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                   <div class="flex items-center gap-3">
                     <Icon name="material-symbols:check-circle" class="h-6 w-6 text-green-600" />
                     <div>
                       <h4 class="text-green-800 font-medium text-sm">{{ t('contact.success.title') }}</h4>
                       <p class="text-green-700 text-xs mt-1">{{ t('contact.success.message') }}</p>
                     </div>
                   </div>
                 </div>

                 <!-- Error Message -->
                 <div v-if="showError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                   <div class="flex items-center gap-3">
                     <Icon name="material-symbols:error" class="h-6 w-6 text-red-600" />
                     <div>
                       <h4 class="text-red-800 font-medium text-sm">{{ t('contact.error.title') }}</h4>
                       <p class="text-red-700 text-xs mt-1">{{ t('contact.error.message') }}</p>
                     </div>
                   </div>
                 </div>

                 <!-- Submit Button -->
                 <div class="pt-2">
                   <button
                     type="submit"
                     :disabled="isSubmitting"
                     class="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-medium hover:from-primary-dark hover:to-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     <Icon v-if="isSubmitting" name="material-symbols:refresh" class="h-4 w-4 animate-spin" />
                     <span>{{ isSubmitting ? t('common.loading') : t('contact.form.submit') }}</span>
                   </button>
                 </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSoundNotifications } from '~/composables/useSoundNotifications'

const { t } = useI18n()
const { playSuccessSound, playErrorSound } = useSoundNotifications()

const props = defineProps<{
  modelValue: boolean
  package_?: any
}>()

const emit = defineEmits(['update:modelValue'])

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const validationErrors = reactive({
  email: '',
  phone: ''
})

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string, countryCode: string) => {
  // Phone regex patterns by country code
  const patterns: { [key: string]: RegExp } = {
    '+20': /^1[0-9]\d{8}$/, // Egypt: 1XXXXXXXXX
    '+966': /^5\d{8}$/, // Saudi Arabia: 5XXXXXXXX
    '+971': /^5\d{8}$/, // UAE: 5XXXXXXXX
    '+974': /^[3-7]\d{7}$/, // Qatar: 3XXXXXXX to 7XXXXXXX
    '+973': /^[3-7]\d{7}$/, // Bahrain: 3XXXXXXX to 7XXXXXXX
    '+965': /^[5-9]\d{7}$/, // Kuwait: 5XXXXXXX to 9XXXXXXX
    '+968': /^[7-9]\d{7}$/, // Oman: 7XXXXXXX to 9XXXXXXX
  }
  return patterns[countryCode]?.test(phone) || false
}

const countries = [
  { code: '+966', flag: '', example: '5X XXX XXXX', key: 'sa' },
  { code: '+20', flag: '', example: '1X XXXX XXXX', key: 'eg' },
  { code: '+971', flag: '', example: '5X XXX XXXX', key: 'ae' },
  { code: '+974', flag: '', example: '3XXX XXXX', key: 'qa' },
  { code: '+973', flag: '', example: '3XXX XXXX', key: 'bh' },
  { code: '+965', flag: '', example: '5XXX XXXX', key: 'kw' },
  { code: '+968', flag: '', example: '9XXX XXXX', key: 'om' }
]

const form = reactive({
  fullName: '',
  email: '',
  countryCode: countries[0].code,
  phone: '',
  message: ''
})

// Initialize message based on package
const { locale } = useI18n()
watch(() => props.package_, (newPackage) => {
  if (newPackage) {
    const currentLocale = locale.value.slice(0, 2)
    form.message = `أنا مهتم بالباقة: ${newPackage[`title_${currentLocale}`]}`
  }
}, { immediate: true })

const closeModal = () => {
  emit('update:modelValue', false)
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Remove any non-numeric characters
  form.phone = input.value.replace(/\D/g, '')
}

const handleSubmit = async () => {
  // Reset validation errors
  validationErrors.email = ''
  validationErrors.phone = ''
  
  // Validate email
  if (!validateEmail(form.email)) {
    validationErrors.email = t('contact.form.email.error')
    return
  }

  // Validate phone
  if (!validatePhone(form.phone, form.countryCode)) {
    validationErrors.phone = t('contact.form.phone.error')
    return
  }

  try {
    isSubmitting.value = true
    showError.value = false
    showSuccess.value = false

    // Submit to appropriate API based on context
    let result
    if (props.package_) {
      // Submit to package contact API
      result = await $fetch('/api/package-contact-form', {
        method: 'POST',
        body: {
          name: form.fullName,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          message: form.message,
          packageId: props.package_.id,
          packageName: props.package_[`title_${locale.value.slice(0, 2)}`],
          locale: locale.value
        }
      })
    } else {
      // Submit to general contact messages API
      result = await $fetch('/api/contact-messages', {
        method: 'POST',
        body: {
          name: form.fullName,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          subject: 'استفسار عام',
          message: form.message,
          type: 'general',
          source: 'website'
        }
      })
    }

    console.log('Form submission result:', result)

    if (result.success) {
      showSuccess.value = true
      form.fullName = ''
      form.email = ''
      form.phone = ''
      form.message = ''
      
      // Show success message and play sound
      showSuccess.value = true
      playSuccessSound()
      
      // Close modal after 3 seconds
      setTimeout(() => {
        closeModal()
      }, 3000)
    } else {
      showError.value = true
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    showError.value = true
    playErrorSound()
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }
  
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>
