<template>
  <NuxtLink 
    :to="localpath(`/packages/${props.package_.id}`)"
    class="group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] transition-all duration-300"
  >
    <div class="relative h-[280px] overflow-hidden">
      <NuxtImg
        :src="props.package_.image_url"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        :alt="props.package_.title_en"
        width="800"
        height="600"
        loading="lazy"
        format="webp"
        quality="85"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      <!-- Hotel Grade Badge -->
      <div v-if="props.package_.included_options && props.package_.included_options.hotel && props.package_.included_options.hotelGrade" class="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
        <span class="flex items-center gap-1 bg-white/90 text-yellow-600 rounded-full px-4 py-2 text-sm font-semibold shadow">
          <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400" />
          {{$t('packages.details.hotel_grade', {grade: props.package_.included_options.hotelGrade})}}
        </span>
      </div>
      <!-- Price Tag -->
      <div class="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <div class="bg-surface/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] transform transition-transform duration-300 hover:scale-105 flex flex-col items-center">
          <span class="text-primary font-medium tracking-wide whitespace-nowrap flex items-center gap-1">
            <SaudiRyialSymbol :size="16" class="text-primary" />
            {{ props.package_.price.toLocaleString() }}
            <span class="text-sm text-gray-700 font-normal">{{$t('packages.details.per_person')}}</span>
            <VTooltip :triggers="['hover', 'focus']" placement="top">
              <Icon name="material-symbols:info-outline" class="w-4 h-4 text-gray-400 cursor-pointer" />
              <template #popper>
                <div class="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs text-center">
                  {{$t('packages.details.price_info_tooltip')}}
                </div>
              </template>
            </VTooltip>
          </span>
        </div>
      </div>

      <!-- Bottom Tags -->
      <div class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        <!-- Duration -->
        <div class="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white transform transition-transform duration-300 hover:scale-105 flex items-center gap-1.5">
          <Icon name="material-symbols:schedule-outline" class="h-4 w-4" />
          {{ $t('packages.details.duration', { count: props.package_.duration_days }) }}
        </div>
        
        <!-- Travel Period -->
        <div v-if="props.package_.travel_period" class="bg-surface/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white flex items-center gap-1.5 transform transition-transform duration-300 hover:scale-105">
          <Icon name="material-symbols:calendar-month-outline" class="h-4 w-4" />
          <p class="text-gray-100">
             {{ props.package_.travel_period }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3 class="text-xl font-semibold mb-2 text-stone-750 transition-colors duration-300 group-hover:text-stone-950">
        {{ locale === 'ar-SA' ? props.package_.title_ar : props.package_.title_en }}
      </h3>
      <p class="mb-4 text-sm text-gray-800 line-clamp-2">
        {{ locale === 'ar-SA' ? props.package_.description_ar : props.package_.description_en }}
      </p>
      <div class="mt-auto flex justify-between items-center">
        <!-- Included Options Icons -->
        <div v-if="props.package_.included_options" class="flex items-center gap-3">
          <FlightIcon v-if="props.package_.included_options.flight" :size="24" class="text-primary" />
          <Icon v-if="props.package_.included_options.hotel" name="material-symbols:hotel-outline" class="h-6 w-6 text-primary" />
          <Icon v-if="props.package_.included_options.transportation" name="material-symbols:directions-car-outline" class="h-6 w-6 text-primary" />
        </div>
        <span class="text-primary font-medium text-sm group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {{ locale === 'ar-SA' ? $t('common.view_details')+ ' ←' : $t('common.view_details') + ' →' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Package } from '~/composables/usePackages'
import SaudiRyialSymbol from '~/components/ui/icons/SaudiRyialSymbol.vue'
import FlightIcon from '~/components/ui/icons/FlightIcon.vue'

// Define props first
const props = defineProps<{
  package_: Package
}>()
const {locale} = useI18n()
const localpath = useLocalePath()
</script>