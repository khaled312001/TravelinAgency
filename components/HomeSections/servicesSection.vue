<template>
  <section class="py-24 bg-gradient-to-b from-surface to-surface-container" data-aos="fade-up">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-20" data-aos="fade-down">
        <span class="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          {{ $t('home.services.subtitle') }}
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {{ $t('home.services.title') }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto text-lg">
          {{ $t('home.services.description') }}
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(service, index) in services"
          :key="service.title_en"
          class="group relative rounded-3xl overflow-hidden h-[420px] backdrop-blur-[2px]"
          data-aos="zoom-in"
          :data-aos-delay="100 * index"
        >
          <!-- Background Image -->
          <NuxtImg
            :src="service.image"
            :alt="$t('home.services.' + service.title_en)"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            format="webp"
            quality="80"
          />

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/15"></div>

          <!-- Glass Effect Overlay -->
          <div class="absolute inset-0 backdrop-blur-sm bg-black/20"></div>

          <!-- Content -->
          <div class="relative h-full flex flex-col items-center justify-center text-center p-8">
            <!-- Icon Container -->
            <div class="mb-6">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 text-white backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                <FlightIcon v-if="service.title_en === 'flight_reservations'" class="w-10 h-10" />
                <Icon v-else :name="service.icon" class="w-10 h-10" />
              </div>
            </div>

            <!-- Text Content -->
            <h3 class="text-2xl font-bold text-white mb-4">
              {{ $t('home.services.' + service.title_en) }}
            </h3>
            <p class="text-white/90 text-base leading-relaxed line-clamp-4">
              {{ $t('home.services.' + service.description_en) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NuxtImg } from '#components';
import FlightIcon from '~/components/ui/icons/FlightIcon.vue'

const services = [
  {
    title_en: 'flight_reservations',
    title_ar: 'حجوزات طيران مميزة',
    description_en: 'flight_reservations_desc',
    description_ar: 'احصل على أفضل أسعار تذاكر الطيران مع شبكة تضم أكثر من 400 شركة طيران عالمية',
    icon: FlightIcon, 
    image: '/images/home/services/flight_reservations.jpg'
  },
  {
    title_en: 'hotel_reservations',
    title_ar: 'إقامات فاخرة',
    description_en: 'hotel_reservations_desc',
    description_ar: 'اكتشف مجموعة منتقاة من الفنادق والمنتجعات الفاخرة حول العالم',
    icon: 'material-symbols:hotel-outline', 
    image: '/images/home/services/hotel_reservations.jpg'
  },
  {
    title_en: 'tour_packages',
    title_ar: 'تجارب سياحية متميزة',
    description_en: 'tour_packages_desc',
    description_ar: 'استمتع برحلات سياحية مصممة بعناية تتضمن تجارب فريدة ولحظات لا تُنسى',
    icon: 'material-symbols:location-on-outline', 
    image: '/images/home/services/tour_packages.jpg'
  },
  {
    title_en: 'travel_insurance',
    title_ar: 'حماية سفر شاملة',
    description_en: 'travel_insurance_desc',
    description_ar: 'سافر براحة بال تامة مع تغطية تأمينية شاملة',
    icon: 'material-symbols-light:security-rounded', 
    image: '/images/home/services/travel_insurance.jpg'
  },
  {
    title_en: 'visa_services',
    title_ar: 'خدمات تأشيرات ميسرة',
    description_en: 'visa_services_desc',
    description_ar: 'خدمات احترافية لاستخراج التأشيرات مع إمكانية تتبع الطلب لحظياً',
    icon: 'material-symbols:description-outline', 
    image: '/images/home/services/visa_services.jpg'
  },
  {
    title_en: 'international_driving_license',
    title_ar: 'رخصة قيادة دولية',
    description_en: 'international_driving_license_desc',
    description_ar: 'احصل على رخصة القيادة الدولية بسرعة وسهولة',
    icon: 'material-symbols:badge-outline', 
    image: '/images/home/services/international_driving_license.jpg'
  },
  {
    title_en: 'tourism_consultation',
    title_ar: 'استشارات سياحية متخصصة',
    description_en: 'tourism_consultation_desc',
    description_ar: 'تخطيط سفر شخصي مع مستشارينا الخبراء',
    icon: 'material-symbols:chat-outline', 
    image: '/images/home/services/tourism_consultation.jpg'
  },
  {
    title_en: 'support_24_7',
    title_ar: 'دعم متواصل على مدار الساعة',
    description_en: 'support_24_7_desc',
    description_ar: 'فريق دعم متخصص جاهز لمساعدتك في أي وقت',
    icon: 'material-symbols:call-outline', 
    image: '/images/home/services/support_24_7.jpg'
  }
]
</script>
