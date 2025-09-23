<template>
  <section class="py-16 bg-surface-container" data-aos="fade-up">
    <div class="container">
      <div class="text-center mb-12" data-aos="fade-down">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {{ t('home.destinations.global.title') }}
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ t('home.destinations.global.subtitle') }}
        </p>
      </div>
      
      <Carousel 
        v-if="globalDestinations && globalDestinations.length > 0"
        :items="globalDestinations"
        @change="handleSlideChange"
      >
        <template #default="{ item: destination, index }">
          <DestinationCard
            :destination="destination"
            :delay="150 * index"
            class="h-full"
          />
        </template>
      </Carousel>

      <div v-else class="text-center text-gray-500">
        {{ t('common.no_destinations') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'
import { useDestinations } from '~/composables/useDestinations'
import DestinationCard from '~/components/destinations/DestinationCard.vue'
import Carousel from '~/components/ui/Carousel.vue'

const { t, locale } = useI18n()
const { globalDestinations } = useDestinations()
const localePath = useLocalePath()
const handleSlideChange = (index: number) => {
  // Handle slide change if needed
}

// SEO Optimization
useHead({
  title: computed(() => `${t('home.destinations.global.title')} | Wonder Land Agency`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('home.destinations.global.subtitle'))
    },
    {
      property: 'og:title',
      content: computed(() => t('home.destinations.global.title'))
    },
    {
      property: 'og:description',
      content: computed(() => t('home.destinations.global.subtitle'))
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image',
      content: computed(() => globalDestinations.value?.[0]?.mainImage || '')
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: globalDestinations.value?.map((destination, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'TouristDestination',
            name: destination.name[locale.value.slice(0, 2)],
            description: destination.description[locale.value.slice(0, 2)],
            image: destination.mainImage,
            url: `${localePath('/destinations')}/${destination.id}`
          }
        }))
      }))
    }
  ]
})
</script>
