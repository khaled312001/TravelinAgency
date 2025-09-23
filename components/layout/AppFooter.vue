<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useWhatsApp } from '~/composables/useWhatsApp';

const { t } = useI18n();
const localePath = useLocalePath();

const { getWhatsAppUrl, whatsappNumber } = useWhatsApp();

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());

// Placeholder data (Replace with actual links/info)
const socialLinks = [
  { name: 'mdi:whatsapp', href: getWhatsAppUrl(), label: 'WhatsApp' },
  { name: 'ic:outline-snapchat', href: 'https://www.snapchat.com/add/ahmed18311', label: 'Snapchat' }, // Assuming 'X' is Twitter
  { name: 'mdi:instagram', href: 'https://www.instagram.com/wonderland.sa.jed?igsh=Nnk3cmV6NDdibTJ2&utm_source=qr', label: 'Instagram' },
  { name: 'ic:outline-tiktok', href: 'https://www.tiktok.com/@wonder.land.sa?_t=ZS-8uH9ccxyZlN&_r=1', label: 'TikTok' },
];

const contactInfo = [
  { icon: 'mdi:phone', textKey: 'footer.phone', detail: whatsappNumber }, // Placeholder
  { icon: 'mdi:email', textKey: 'footer.email', detail: 'ahmed@wonderland1.com' }, // Placeholder
  { icon: 'mdi:whatsapp', textKey: 'footer.whatsapp', detail: whatsappNumber } // Placeholder
]

const certifications = [
  // { key: 'footer.iata', value: 'XXX12345' },
  { key: 'footer.license', value: '73105863' },
  // { key: 'footer.insurance', value: 'Provided by ZZZ Insurers' },
  { key: 'footer.registration', value: '7043491153' },
];

// Featured Destinations Data (Text Links Only)
const featuredDestinations = ref([
  { nameKey: 'footer.destinations.riyadh', link: '/destinations/riyadh' }, // Placeholder link
  { nameKey: 'footer.destinations.red_sea', link: '/destinations/red-sea' }, // Placeholder link
  { nameKey: 'footer.destinations.alula', link: '/destinations/alula/' },    // Placeholder link
]);

</script>

<template>
  <footer class="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        <!-- 1. Branding & Contact -->
        <div class="space-y-6">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center space-x-3 rtl:space-x-reverse">
            <NuxtImg src="/images/home/logo/WonderlandLogoWhite.svg" alt="Wonderland Logo" class="h-10"
              loading="eager" />
            <span class="text-white font-semibold text-xl">{{ $t('common.app_title') }}</span>
          </NuxtLink>
          <p class="text-gray-400 text-sm">{{ $t('footer.tagline') }}</p>
          <div class="space-y-3">
            <h4 class="text-lg font-semibold text-white mb-3">{{ $t('footer.contact_us') }}</h4>
            <template v-for="(contact, index) in contactInfo" :key="index">
              <a v-if="contact.icon === 'mdi:whatsapp'" :href="getWhatsAppUrl()" target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 text-sm text-gray-400 hover:text-primary-400 transition-colors py-1">
                <Icon :name="contact.icon" class="text-xl text-primary-500 flex-shrink-0" />
                <span>
                  {{ $t(contact.textKey) }}:
                  <span dir="ltr" class="inline-block ltr:text-left rtl:text-right">{{ contact.detail }}</span>
                </span>
              </a>
              <a v-else :href="contact.icon === 'mdi:email' ? `mailto:${contact.detail}` : `tel:${contact.detail}`"
                class="flex items-center space-x-3 text-sm text-gray-400 hover:text-primary-400 transition-colors py-1">
                <Icon :name="contact.icon" class="text-xl text-primary-500 flex-shrink-0" />
                <span>
                  {{ $t(contact.textKey) }}:
                  <span dir="ltr" class="inline-block ltr:text-left rtl:text-right">{{ contact.detail }}</span>
                </span>
              </a>
            </template>
          </div>
        </div>

        <!-- 2. Certifications -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">{{ $t('footer.certifications') }}</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="cert in certifications" :key="cert.key">
              <span class="text-gray-400">{{ $t(cert.key) }} {{ cert.value }}</span>
            </li>
          </ul>
        </div>

        <!-- 3. Connect With Us -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">{{ $t('footer.connect') }}</h4>
          <div class="flex space-x-4 rtl:space-x-reverse">
            <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-primary-400 transition-colors flex items-center justify-center"
              :aria-label="social.label">
              <Icon :name="social.name" class="text-2xl flex-shrink-0" />
            </a>
          </div>
        </div>

        <!-- 4. Featured Destinations (Text Links) -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white">{{ $t('footer.featured_destinations') }}</h4>
          <ul class="space-y-2">
            <li v-for="(dest, index) in featuredDestinations" :key="`dest-${index}`" class="group">
              <NuxtLink :to="localePath(dest.link)"
                class="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="mdi:map-marker"
                  class="text-primary-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                <span>
                  {{ $t(dest.nameKey) }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright -->
      <div class="text-center text-sm text-gray-500 mt-16 border-t border-gray-700 pt-8">
        {{ $t('footer.copyright', { year: currentYear }) }}
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Add minor transition for better visual feedback */
input,
textarea {
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Ensure links have appropriate styling if needed */
ul a {
  display: inline-block;
  /* Prevents hover effect covering full width */
}
</style>
