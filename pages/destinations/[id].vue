<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <span class="sr-only">{{ t('common.loading') }}</span>
    </div>

    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ t('common.error') }}</h1>
      <p class="text-gray-600 mb-8">{{ error.message }}</p>
      <NuxtLink 
        to="/" 
        class="rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-dark transition-colors"
      >
        {{ t('common.back_home') }}
      </NuxtLink>
    </div>

    <div 
      v-else-if="destination" 
      class="relative min-h-screen"
    >
      <!-- Hero Section -->
      <div 
        class="relative h-[40vh] md:h-[60vh] w-full"
      >
        <NuxtImg
          :src="destination.mainImage"
          class="h-full w-full object-cover"
          :alt="getLocalizedName"
          loading="eager"
          width="1920"
          height="1080"
          format="webp"
          quality="90"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 -mt-32 rounded-t-[2.5rem] bg-white px-4 pb-20 pt-12 md:px-8">
        <div class="mx-auto max-w-6xl">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">
            {{ getLocalizedName }}
          </h1>
          <p class="mb-12 text-lg text-gray-600 max-w-3xl">
            {{ getLocalizedDescription }}
          </p>

          <!-- Tourist Spots -->
          <section v-if="destination.touristSpots?.length" class="mb-16">
            <h2 class="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
              <Icon name="material-symbols:location-on" class="h-6 w-6 text-primary" />
              {{ t('home.destinations.tourist_spots') }}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="spot in destination.touristSpots" 
                :key="spot.id"
                class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div class="relative h-48">
                  <NuxtImg
                    :src="spot.image || destination.gallery?.[0] || destination.mainImage"
                    :alt="spot.name[locale.slice(0, 2)]"
                    class="w-full h-full object-cover"
                    width="600"
                    height="400"
                    format="webp"
                    quality="85"
                  />
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold mb-3 text-gray-900">{{ spot.name[locale.slice(0, 2)] }}</h3>
                  <p class="text-gray-600">{{ spot.description[locale.slice(0, 2)] }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Upcoming Events -->
          <section v-if="destination.upcomingEvents?.length" class="mb-16">
            <h2 class="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
              <Icon name="material-symbols:calendar-month-outline" class="h-6 w-6 text-primary" />
              {{ t('home.destinations.upcoming_events') }}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="event in destination.upcomingEvents" 
                :key="event.id"
                class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
              >
                <div v-if="event.image" class="relative h-40 -mx-6 -mt-6 mb-6">
                  <NuxtImg
                    :src="event.image"
                    :alt="event.title[locale.slice(0, 2)]"
                    class="w-full h-full object-cover"
                    width="400"
                    height="300"
                    format="webp"
                    quality="85"
                  />
                </div>
                <h3 class="text-xl font-semibold mb-3 text-gray-900">{{ event.title[locale.slice(0, 2)] }}</h3>
                <p class="text-gray-600 mb-4">{{ event.description[locale.slice(0, 2)] }}</p>
                <div class="flex items-center text-sm text-gray-500">
                  <Icon name="material-symbols:calendar-month-outline" class="w-5 h-5 mr-2" />
                  {{ formatDate(event.date) }}
                </div>
              </div>
            </div>
          </section>

          <!-- Contact Section -->
          <section class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
            <h2 class="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">
              {{ t('home.destinations.plan_your_trip') }}
            </h2>
            <p class="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
              {{ t('home.destinations.contact_description') }}
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                @click="showContactForm = true"
                class="w-full sm:w-auto rounded-full bg-primary-500 px-6 sm:px-8 py-4 text-white hover:bg-primary-800 transition-colors text-base sm:text-lg font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Icon name="material-symbols:chat" class="h-5 w-5" />
                {{ t('home.destinations.cta_button') }}
              </button>
              <DestinationContactFormModal v-if="showContactForm" :destinationName="getLocalizedName" @close="showContactForm = false"></DestinationContactFormModal>
              <a 
                :href="getWhatsAppUrl(t('whatsapp.messages.destination_interest', { name: getLocalizedName }))"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto rounded-full bg-[#25D366] px-6 sm:px-8 py-4 text-white hover:bg-[#128C7E] transition-colors text-base sm:text-lg font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
              <Icon name="logos:whatsapp-icon" class="w-5 h-5" />
                {{ t('buttons.whatsapp') }}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDestinations } from '~/composables/useDestinations'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWhatsApp } from '~/composables/useWhatsApp'
import DestinationContactFormModal from '~/components/ui/modals/DestinationContactFormModal.vue'

const route = useRoute()
const { t, locale } = useI18n()
const { getWhatsAppUrl } = useWhatsApp()
const { getDestinationById } = useDestinations()
const showContactForm = ref(false)

// Fetch destination data with proper error handling
const { data: destination, pending, error } = await useAsyncData(
  `destination-${route.params.id as string}`,
  () => {
    const dest = getDestinationById(route.params.id as string)
    if (!dest) {
      throw createError({
        statusCode: 404,
        message: 'Destination not found'
      })
    }
    return dest
  }
)

// Computed properties for localized content
const getLocalizedName = computed(() => {
  return destination.value?.name[locale.value.slice(0, 2)] || ''
})

const getLocalizedDescription = computed(() => {
  return destination.value?.description[locale.value.slice(0, 2)] || ''
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value.slice(0, 2), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO
useHead({
  title: computed(() => destination.value ? `${destination.value.name[locale.value.slice(0,2)]} | Wonder Land Agency` : 'Loading...'),
  meta: [
    {
      name: 'description',
      content: computed(() => destination.value?.description[locale.value.slice(0, 2)] || '')
    }
  ]
})
</script>
