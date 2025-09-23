import type { NotificationResult, PackageInquiry, DestinationInquiry } from '~/types/whatsapp'
import { ref } from 'vue'

export const useWhatsApp = () => {
  const whatsappNumber = '+966500982394'
  const whatsappBaseUrl = 'https://wa.me'
  const { locale } = useI18n()

  const notificationSent = ref(false)
  const notificationError = ref<string | null>(null)
  const isLoading = ref(false)

  /**
   * Get WhatsApp contact URL with optional message
   * @param message Optional pre-filled message
   * @returns Full WhatsApp URL
   */
  const getWhatsAppUrl = (message?: string) => {
    const baseUrl = `${whatsappBaseUrl}/${whatsappNumber}`
    if (!message) return baseUrl
    
    const encodedMessage = encodeURIComponent(message)
    return `${baseUrl}?text=${encodedMessage}`
  }

  /**
   * Send a WhatsApp notification via Twilio for package inquiries
   * @param data Form data to send in the notification
   * @returns Notification result with success status and optional error
   */
  const sendPackageNotification = async (data: Partial<PackageInquiry>): Promise<NotificationResult> => {
    isLoading.value = true
    notificationError.value = null
    
    try {
      const response = await $fetch<{
        success: boolean;
        inquiryId: string;
        notificationSent: boolean;
        notificationId?: string;
        error?: string;
      }>('/api/package-contact-form', {
        method: 'POST',
        body: {
          ...data,
          locale: locale.value
        }
      })
      
      if (response.success) {
        notificationSent.value = true
      } else {
        notificationError.value = response.error || 'Unknown error occurred'
      }
      
      return {
        success: response.notificationSent,
        messageId: response.notificationId,
        error: response.error
      }
    } catch (error: any) {
      console.error('Failed to send WhatsApp notification:', error)
      
      notificationError.value = error.message || 'Failed to send notification'
      
      // Return error information for the UI
      return {
        success: false,
        error: notificationError.value || 'Failed to send notification'
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Send a WhatsApp notification via Twilio for destination inquiries
   * @param data Form data to send in the notification
   * @returns Notification result with success status and optional error
   */
  const sendDestinationNotification = async (data: Partial<DestinationInquiry>): Promise<NotificationResult> => {
    isLoading.value = true
    notificationError.value = null
    
    try {
      const response = await $fetch<{
        success: boolean;
        inquiryId: string;
        notificationSent: boolean;
        notificationId?: string;
        error?: string;
      }>('/api/destination-contact-form', {
        method: 'POST',
        body: {
          ...data,
          locale: locale.value
        }
      })
      
      if (response.success) {
        notificationSent.value = true
      } else {
        notificationError.value = response.error || 'Unknown error occurred'
      }
      
      return {
        success: response.notificationSent,
        messageId: response.notificationId,
        error: response.error
      }
    } catch (error: any) {
      console.error('Failed to send destination WhatsApp notification:', error)
      
      notificationError.value = error.message || 'Failed to send notification'
      
      // Return error information for the UI
      return {
        success: false,
        error: notificationError.value || 'Failed to send notification'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    whatsappNumber,
    getWhatsAppUrl,
    sendPackageNotification,
    sendDestinationNotification,
    notificationSent,
    notificationError,
    isLoading
  }
}
