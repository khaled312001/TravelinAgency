<template>
  <div 
    class="relative h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <NuxtLink :to="localpath(`/destinations/${destination.id}`)">
      <!-- Image Container -->
      <div class="absolute inset-0 bg-gray-100">
        <NuxtImg
          :src="destination.mainImage"
          :alt="getLocalizedName"
          class="w-full h-full object-cover transition-transform duration-300"
          :class="{ 'scale-110': isHovered }"
          @error="handleImageError"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:400px md:500px lg:600px"
          placeholder
        />
      </div>

      <!-- Gradient Overlay -->
      <div 
        class="absolute inset-0 transition-opacity duration-300"
        :class="[
          'bg-gradient-to-t',
          isHovered 
            ? 'from-black/90 via-black/50 to-transparent' 
            : 'from-black/80 via-black/30 to-transparent'
        ]"
      ></div>

      <!-- Content -->
      <div class="relative h-full flex flex-col justify-end p-6">
        <!-- Location Tag -->
        <div class="flex items-center gap-2 mb-2">
          <span 
            class="text-sm transition-opacity duration-300"
            :class="isHovered ? 'text-white' : 'text-white/80'"
          >
            {{ getLocalizedRegion }}
          </span>
        </div>

        <!-- Title -->
        <h3 
          :dir="$i18n.locale === 'ar-SA' ? 'rtl' : 'ltr'"
          class="text-white text-2xl font-semibold mb-2 line-clamp-2 transition-transform duration-300"
          :class="{ 'translate-y-0': isHovered, 'translate-y-1': !isHovered }"
        >
          {{ getLocalizedName }}
        </h3>

        <!-- Location Info -->
        <div 
          class="flex items-center gap-4 transition-opacity duration-300"
          :class="isHovered ? 'text-white' : 'text-white/90'"
        >
          <div class="flex items-center gap-1">
            <span class="text-sm">{{ getLocalizedLocationType }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-sm">{{ getLocalizedDestinationType }}</span>
          </div>
        </div>

        <!-- Learn More Link -->
        <div 
          class="mt-4 transition-all duration-300"
          :class="{ 'translate-y-0 opacity-100': isHovered, 'translate-y-2 opacity-0': !isHovered }"
        >
          <span 
            class="text-white text-sm relative inline-block group/learn cursor-pointer"
            :dir="$i18n.locale === 'ar-SA' ? 'rtl' : 'ltr'"
          >
            <span class="relative">
              {{ t('home.destinations.learn_more') }}
              <span 
                class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover/learn:w-full"
                :class="{ 'opacity-50': !isHovered }"
              ></span>
            </span>
            <Icon 
              name="material-symbols:arrow-forward-rounded" 
              class="w-4 h-4 inline-block transition-transform duration-300 group-hover/learn:translate-x-1 rtl:rotate-180"
              :class="$i18n.locale === 'ar-SA' ? 'mr-1' : 'ml-1'"
            />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Destination } from '~/types/destination'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  destination: Destination
  delay?: number
}>()

const { locale, t } = useI18n()
const localpath = useLocalePath()
const isHovered = ref(false)

const handleImageError = (event: Event) => {
  console.error('Image failed to load:', props.destination.mainImage)
  const img = event.target as HTMLImageElement
  img.src = '/images/hero-bg.jpg'
}

const getLocalizedName = computed(() => 
  props.destination.name[locale.value.slice(0, 2) as keyof typeof props.destination.name] || props.destination.name.en
)

const getLocalizedDescription = computed(() => 
  props.destination.description[locale.value.slice(0, 2) as keyof typeof props.destination.description] || props.destination.description.en
)

const getLocalizedRegion = computed(() => 
  props.destination.region[locale.value.slice(0, 2) as keyof typeof props.destination.region] || props.destination.region.en
)

const getLocalizedLocationType = computed(() => 
  props.destination.locationType.name[locale.value.slice(0, 2) as keyof typeof props.destination.locationType.name] || 
  props.destination.locationType.name.en
)

const getLocalizedDestinationType = computed(() => 
  props.destination.destinationType.name[locale.value.slice(0, 2) as keyof typeof props.destination.destinationType.name] || 
  props.destination.destinationType.name.en
)
</script>
