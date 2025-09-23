<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-300" 
         :class="{ 'scale-100 opacity-100': modelValue, 'scale-95 opacity-0': !modelValue }"
         @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-display text-2xl font-semibold text-gray-900">{{ t('contact.title') }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-8 text-gray-600">
        <p class="text-lg mb-2">{{ t('contact.description') }} <span class="text-primary font-medium">{{ t('contact.free') }}</span>.</p>
        <p class="text-gray-500">{{ t('contact.subDescription') }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-6">
          <div>
            <label for="fullName" class="block text-gray-700 font-medium mb-2">{{ t('contact.form.fullName.label') }}</label>
            <input
              v-model="form.fullName"
              type="text"
              id="fullName"
              required
              :placeholder="t('contact.form.fullName.placeholder')"
              class="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 transition-colors placeholder:text-gray-400 outline-none text-gray-700"
            />
          </div>
          
          <div>
            <label for="email" class="block text-gray-700 font-medium mb-2">{{ t('contact.form.email.label') }}</label>
            <input
              v-model="form.email"
              type="text"
              id="email"
              required
              :placeholder="t('contact.form.email.placeholder')"
              class="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 transition-colors placeholder:text-gray-400 outline-none text-gray-700"
              :class="{ 'border-red-500': validationErrors.email }"
            />
            <p v-if="validationErrors.email" class="mt-1 text-red-500 text-sm">{{ validationErrors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-gray-700 font-medium mb-2">{{ t('contact.form.phone.label') }}</label>
            <div class="flex gap-2">
              <select
                v-model="form.countryCode"
                class="px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 transition-colors outline-none text-gray-700"
                :class="{ 'border-red-500': validationErrors.phone }"
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
                class="flex-1 px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 transition-colors placeholder:text-gray-400 outline-none text-gray-700"
                :class="{ 'text-right': $i18n.locale === 'ar', 'border-red-500': validationErrors.phone }"
                pattern="[0-9]*"
                inputmode="numeric"
                @input="handlePhoneInput"
              />
            </div>
            <p v-if="validationErrors.phone" class="mt-1 text-red-500 text-sm">{{ validationErrors.phone }}</p>
          </div>

          <div>
            <label for="message" class="block text-gray-700 font-medium mb-2">{{ t('contact.form.message.label') }}</label>
            <textarea
              v-model="form.message"
              id="message"
              rows="4"
              required
              :placeholder="t('contact.form.message.placeholder')"
              class="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 transition-colors placeholder:text-gray-400 outline-none text-gray-700"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-primary text-white py-4 rounded-2xl font-medium hover:bg-primary-dark transition-colors"
        >
          {{ t('contact.form.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  message: props.package_ ? `I'm interested in the ${props.package_.title} package.` : ''
})

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


    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    showSuccess.value = true
    form.fullName = ''
    form.email = ''
    form.phone = ''
    form.message = ''
    
    // Close modal after 2 seconds
    setTimeout(() => {
      closeModal()
    }, 2000)
  } catch (error) {
    showError.value = true
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
