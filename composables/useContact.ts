import { useSupabase } from './useSupabase'
import { useI18n } from 'vue-i18n'

export interface ContactFormData {
  name: string
  phone: string
  email: string
  details: string
  destinationName?: string
}

export const useContact = () => {
  const { t } = useI18n()
  const client = useSupabase()
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  async function submitDestinationContact(formData: ContactFormData) {
    isSubmitting.value = true
    error.value = null

    try {
      const { error: submitError } = await client
        .from('contact_requests')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            details: formData.details,
            destination_name: formData.destinationName,
            type: 'destination',
            status: 'new'
          }
        ])

      if (submitError) throw submitError

      // Show success toast
      const toast = useToast()
      toast.success(t('contact.success'))

      return { success: true }
    } catch (e) {
      console.error('Error submitting contact form:', e)
      error.value = t('contact.error')
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    submitDestinationContact,
    isSubmitting,
    error
  }
}
