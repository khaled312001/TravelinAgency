<template>
  <section 
    class="py-16 md:py-24"
    :style="{
      backgroundColor: section.background_color || '#ffffff'
    }"
  >
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div v-if="section.title || section.subtitle" class="text-center mb-16">
          <h2 
            v-if="section.title"
            class="text-3xl md:text-4xl font-bold mb-4"
            :style="{ color: section.text_color || '#1f2937' }"
          >
            {{ section.title }}
          </h2>
          <p 
            v-if="section.subtitle"
            class="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {{ section.subtitle }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div>
            <h3 class="text-2xl font-semibold mb-8 text-gray-900">معلومات التواصل</h3>
            
            <!-- Contact Cards -->
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="p-3 bg-blue-100 rounded-lg ml-4">
                  <Icon name="material-symbols:location-on" class="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">العنوان</h4>
                  <p class="text-gray-600">{{ getSetting('contact', 'contact_address', 'الرياض، المملكة العربية السعودية') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="p-3 bg-green-100 rounded-lg ml-4">
                  <Icon name="material-symbols:phone" class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">الهاتف</h4>
                  <p class="text-gray-600">{{ getSetting('contact', 'contact_phone', '+966 50 123 4567') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="p-3 bg-purple-100 rounded-lg ml-4">
                  <Icon name="material-symbols:email" class="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">البريد الإلكتروني</h4>
                  <p class="text-gray-600">{{ getSetting('contact', 'contact_email', 'info@wonderland.com') }}</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="mt-8">
              <h4 class="font-semibold text-gray-900 mb-4">تابعنا على</h4>
              <div class="flex space-x-4 space-x-reverse">
                <a
                  v-if="getSetting('social', 'social_facebook')"
                  :href="getSetting('social', 'social_facebook')"
                  target="_blank"
                  class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Icon name="material-symbols:facebook" class="h-6 w-6" />
                </a>
                <a
                  v-if="getSetting('social', 'social_twitter')"
                  :href="getSetting('social', 'social_twitter')"
                  target="_blank"
                  class="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Icon name="material-symbols:twitter" class="h-6 w-6" />
                </a>
                <a
                  v-if="getSetting('social', 'social_instagram')"
                  :href="getSetting('social', 'social_instagram')"
                  target="_blank"
                  class="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Icon name="material-symbols:instagram" class="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <h3 class="text-2xl font-semibold mb-8 text-gray-900">أرسل لنا رسالة</h3>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Icon v-if="submitting" name="material-symbols:refresh" class="h-5 w-5 ml-2 animate-spin" />
                {{ submitting ? 'جاري الإرسال...' : 'إرسال الرسالة' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { getSetting } = useCMS()

const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      section_type: 'contact',
      title: '',
      subtitle: '',
      background_color: '#ffffff',
      text_color: '#000000'
    })
  }
})

// Form state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)

// Methods
const submitForm = async () => {
  try {
    submitting.value = true
    
    // Here you would typically send the form data to your API
    // For now, we'll just simulate a submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.')
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
  } finally {
    submitting.value = false
  }
}
</script>
