<template>
  <div class="mx-auto max-w-4xl">
    <!-- Overview Section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('packages.details.overview') }}</h2>
      <h1 class="mb-4 text-4xl font-bold">
        {{ locale === 'ar-SA' ? package_.title_ar : package_.title_en }}
      </h1>
      <p class="mb-8 text-lg text-gray-700">
        {{ locale === 'ar-SA' ? package_.description_ar : package_.description_en }}
      </p>
    </div>

    <!-- Travel Information Section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('packages.details.package_info') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <Icon name="material-symbols:schedule-outline" class="h-6 w-6 text-primary" />
          <div>
            <div class="font-medium">{{ t('packages.details.duration') }}</div>
            <div class="text-gray-700">{{ t('packages.details.duration', { count: package_?.duration_days }) }}</div>
          </div>
        </div>
        
        <div v-if="package_?.travel_period" class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <Icon name="material-symbols:date-range-outline" class="h-6 w-6 text-primary" />
          <div>
            <div class="font-medium">{{ t('packages.details.travel_period') }}</div>
            <div class="text-gray-700">{{ package_?.travel_period }}</div>
          </div>
        </div>
        
        <div v-if="package_?.price" class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <SaudiRyialSymbol :size="24" class="text-primary" />
          <div>
            <div class="font-medium">{{$t('packages.details.price')}}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-gray-700">{{ package_?.price.toLocaleString() }}</span>
              <span class="text-base text-gray-700 font-normal">{{$t('packages.details.per_person')}}</span>
              <VTooltip :triggers="['hover', 'focus']" placement="top">
                <Icon name="material-symbols:info-outline" class="w-5 h-5 text-gray-400 cursor-pointer" />
                <template #popper>
                  <div class="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs text-center">
                    {{$t('packages.details.price_info_tooltip')}}
                  </div>
                </template>
              </VTooltip>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <Icon name="material-symbols:group-outline" class="h-6 w-6 text-primary" />
          <div>
            <div class="font-medium">{{ t('packages.details.travelers') }}</div>
            <div class="text-gray-700">{{ t('packages.details.max_persons_qty', { count: package_?.max_persons }) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Included Services Section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('packages.details.included_services') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-if="package_?.included_options.flight" class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <FlightIcon :size="24" class="text-primary" />
          <span class="font-medium">{{ t('packages.details.flight') }}</span>
        </div>
        <div v-if="package_?.included_options.hotel" class="flex flex-col gap-1 bg-gray-50 p-4 rounded-xl">
          <div class="flex items-center gap-3">
            <Icon name="material-symbols:hotel-outline" class="h-6 w-6 text-primary" />
            <span class="font-medium">{{ t('packages.details.hotel') }}</span>
          </div>
          <div v-if="package_?.included_options.hotelGrade" class="flex items-center gap-1 mt-1">
            <Icon v-for="n in package_.included_options.hotelGrade" :key="n" name="material-symbols:star" class="w-4 h-4 text-yellow-400" aria-label="star" />
            <span class="text-xs text-gray-700">{{ t('packages.details.hotel_grade', {grade: package_.included_options.hotelGrade}) }}</span>
          </div>
        </div>
        <div v-if="package_?.included_options.transportation" class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <Icon name="material-symbols:directions-car-outline" class="h-6 w-6 text-primary" />
          <span class="font-medium">{{ t('packages.details.transportation') }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Card -->
    <div class="bg-primary/5 rounded-2xl p-6 md:p-8 mb-12">
      <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div class="flex-1">
          <h3 class="text-2xl font-bold mb-3 md:mb-4">{{ t('packages.details.custom_package.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ t('packages.details.custom_package.description') }}</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="showContactForm = true"
              class="rounded-full bg-primary-500 px-8 py-3 text-white hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="material-symbols:chat" class="h-5 w-5" />
              <span>{{ t('packages.details.custom_package.cta') }}</span>
            </button>
            <a 
              :href="getWhatsAppUrl(`${t('whatsapp.messages.package_interest', { name: props.package_[`title_${locale.slice(0, 2)}`] })}`)"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full bg-[#25D366] px-8 py-3 text-white hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="logos:whatsapp-icon" class="w-5 h-5" />
              <span>{{$t('packages.details.custom_package.cta_whatsapp')}}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Contact Form Modal -->
  <PackageContactFormModal 
    v-if="showContactForm"
    :package_="package_"
    @close="showContactForm = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FlightIcon from '~/components/ui/icons/FlightIcon.vue'
import SaudiRyialSymbol from '~/components/ui/icons/SaudiRyialSymbol.vue'
import PackageContactFormModal from '~/components/ui/modals/PackageContactFormModal.vue'
import { useWhatsApp } from '~/composables/useWhatsApp'

const props = defineProps(['package_'])
const showContactForm = ref(false)
const { t, locale } = useI18n()
const { getWhatsAppUrl } = useWhatsApp()
</script>
