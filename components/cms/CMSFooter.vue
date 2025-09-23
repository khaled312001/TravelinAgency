<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="md:col-span-2">
          <div class="flex items-center mb-4">
            <img
              v-if="getSetting('general', 'site_logo')"
              :src="getSetting('general', 'site_logo')"
              :alt="getSetting('general', 'site_name', 'Wonder Land')"
              class="h-10 w-auto"
            />
            <div v-else class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="material-symbols:travel" class="h-6 w-6 text-white" />
            </div>
            <span class="mr-3 text-xl font-bold">
              {{ getSetting('general', 'site_name', 'Wonder Land') }}
            </span>
          </div>
          <p class="text-gray-300 mb-4">
            {{ getSetting('general', 'site_tagline', 'وكالة السفر الرائدة في المملكة العربية السعودية') }}
          </p>
          <p class="text-gray-400 text-sm">
            {{ getSetting('contact', 'contact_address', 'الرياض، المملكة العربية السعودية') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">روابط سريعة</h3>
          <ul class="space-y-2">
            <li v-for="item in footerMenu" :key="item.id">
              <NuxtLink
                :to="item.url"
                class="text-gray-300 hover:text-white transition-colors"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">تواصل معنا</h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <Icon name="material-symbols:phone" class="h-5 w-5 text-blue-400 ml-2" />
              <span class="text-gray-300">
                {{ getSetting('contact', 'contact_phone', '+966 50 123 4567') }}
              </span>
            </div>
            <div class="flex items-center">
              <Icon name="material-symbols:email" class="h-5 w-5 text-blue-400 ml-2" />
              <span class="text-gray-300">
                {{ getSetting('contact', 'contact_email', 'info@wonderland.com') }}
              </span>
            </div>
            <div class="flex items-center">
              <Icon name="material-symbols:location-on" class="h-5 w-5 text-blue-400 ml-2" />
              <span class="text-gray-300">
                {{ getSetting('contact', 'contact_address', 'الرياض، المملكة العربية السعودية') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex space-x-4 space-x-reverse mb-4 md:mb-0">
            <a
              v-if="getSetting('social', 'social_facebook')"
              :href="getSetting('social', 'social_facebook')"
              target="_blank"
              class="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="material-symbols:facebook" class="h-5 w-5" />
            </a>
            <a
              v-if="getSetting('social', 'social_twitter')"
              :href="getSetting('social', 'social_twitter')"
              target="_blank"
              class="p-2 bg-blue-400 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Icon name="material-symbols:twitter" class="h-5 w-5" />
            </a>
            <a
              v-if="getSetting('social', 'social_instagram')"
              :href="getSetting('social', 'social_instagram')"
              target="_blank"
              class="p-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Icon name="material-symbols:instagram" class="h-5 w-5" />
            </a>
            <a
              v-if="getSetting('social', 'social_linkedin')"
              :href="getSetting('social', 'social_linkedin')"
              target="_blank"
              class="p-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Icon name="material-symbols:linkedin" class="h-5 w-5" />
            </a>
          </div>
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} {{ getSetting('general', 'site_name', 'Wonder Land') }}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { getMenu, getSetting, loadNavigation } = useCMS()

// State
const footerMenu = ref([])

// Load footer navigation
const loadFooterMenu = async () => {
  await loadNavigation('footer')
  footerMenu.value = getMenu('footer')
}

// Load data on mount
onMounted(() => {
  loadFooterMenu()
})
</script>
