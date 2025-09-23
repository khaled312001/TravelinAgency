<template>
  <div class="media-gallery-page">
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          معرض الوسائط الشامل
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
          عرض جميع الصور والفيديوهات المستخدمة في الموقع مع إمكانية التحميل والمشاهدة
        </p>
      </div>
    </section>

    <!-- Filter Navigation -->
    <section class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <nav class="flex flex-wrap justify-center gap-4 py-4">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="activeCategory = category.id"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="activeCategory === category.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            <Icon :name="category.icon" class="h-5 w-5 inline ml-2" />
            {{ category.title }}
          </button>
        </nav>
      </div>
    </section>

    <!-- Media Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Videos -->
      <section v-if="activeCategory === 'videos'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">فيديوهات قسم البطل</h2>
          <p class="section-description">فيديوهات خلفية عالية الجودة للصفحة الرئيسية</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="aspect-video bg-gray-900">
              <video 
                class="w-full h-full object-cover"
                controls
                poster="/images/home/heroSection/hero-image.webp"
              >
                <source src="/videos/hero/desktop/hero-desktop.webm" type="video/webm">
                <source src="/videos/hero/desktop/hero-desktop.mp4" type="video/mp4">
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">فيديو سطح المكتب</h3>
              <p class="text-gray-600 mb-4">فيديو خلفية عالي الجودة لشاشات سطح المكتب</p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">WebM</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">MP4</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">1080p</span>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="aspect-video bg-gray-900">
              <video 
                class="w-full h-full object-cover"
                controls
                poster="/images/home/heroSection/hero-image.webp"
              >
                <source src="/videos/hero/mobile/hero-mobile-center.webm" type="video/webm">
                <source src="/videos/hero/mobile/hero-mobile-center.mp4" type="video/mp4">
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">فيديو الهاتف المحمول</h3>
              <p class="text-gray-600 mb-4">فيديو محسن للهواتف المحمولة والأجهزة اللوحية</p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">WebM</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">MP4</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">720p</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Service Images -->
      <section v-if="activeCategory === 'services'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">صور الخدمات</h2>
          <p class="section-description">صور عالية الجودة لجميع خدمات الوكالة</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="service in serviceImages" 
            :key="service.name"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            @click="openImageModal(service)"
          >
            <div class="aspect-video bg-gray-100">
              <img 
                :src="service.image" 
                :alt="service.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Destination Images -->
      <section v-if="activeCategory === 'destinations'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">صور الوجهات</h2>
          <p class="section-description">صور جميلة للوجهات السياحية العالمية والمحلية</p>
        </div>
        
        <!-- Global Destinations -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">الوجهات العالمية</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="destination in globalDestinations" 
              :key="destination.name"
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              @click="openImageModal(destination)"
            >
              <div class="aspect-video bg-gray-100">
                <img 
                  :src="destination.image" 
                  :alt="destination.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-1">{{ destination.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ destination.country }}</p>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in destination.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Saudi Destinations -->
        <div>
          <h3 class="text-2xl font-bold mb-6 text-gray-800">الوجهات السعودية</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="destination in saudiDestinations" 
              :key="destination.name"
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              @click="openImageModal(destination)"
            >
              <div class="aspect-video bg-gray-100">
                <img 
                  :src="destination.image" 
                  :alt="destination.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-1">{{ destination.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ destination.region }}</p>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in destination.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Package Images -->
      <section v-if="activeCategory === 'packages'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">صور الباقات</h2>
          <p class="section-description">صور الباقات السياحية المميزة</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="package_ in packageImages" 
            :key="package_.name"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            @click="openImageModal(package_)"
          >
            <div class="aspect-video bg-gray-100">
              <img 
                :src="package_.image" 
                :alt="package_.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-1">{{ package_.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ package_.destination }}</p>
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-primary-600">{{ package_.price }}</span>
                <span class="text-sm text-gray-500">{{ package_.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Images -->
      <section v-if="activeCategory === 'about'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">صور صفحة من نحن</h2>
          <p class="section-description">صور تستخدم في صفحة من نحن</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="image in aboutImages" 
            :key="image.name"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            @click="openImageModal(image)"
          >
            <div class="aspect-video bg-gray-100">
              <img 
                :src="image.image" 
                :alt="image.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2">{{ image.name }}</h3>
              <p class="text-sm text-gray-600">{{ image.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Logos and Icons -->
      <section v-if="activeCategory === 'logos'" class="media-section">
        <div class="section-header">
          <h2 class="section-title">الشعارات والأيقونات</h2>
          <p class="section-description">شعارات الموقع والأيقونات المستخدمة</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="logo in logos" 
            :key="logo.name"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            @click="openImageModal(logo)"
          >
            <div class="aspect-square bg-gray-50 flex items-center justify-center p-8">
              <img 
                :src="logo.image" 
                :alt="logo.name"
                class="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2">{{ logo.name }}</h3>
              <p class="text-sm text-gray-600">{{ logo.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closeImageModal"
    >
      <div class="max-w-4xl max-h-full bg-white rounded-xl overflow-hidden" @click.stop>
        <div class="aspect-video bg-gray-100">
          <img 
            :src="selectedImage.image" 
            :alt="selectedImage.name"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-bold mb-2">{{ selectedImage.name }}</h3>
          <p class="text-gray-600 mb-4">{{ selectedImage.description }}</p>
          <div class="flex justify-between items-center">
            <button 
              @click="downloadImage(selectedImage)"
              class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              تحميل الصورة
            </button>
            <button 
              @click="closeImageModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top Button -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors z-40"
    >
      <Icon name="material-symbols:keyboard-arrow-up" class="h-6 w-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Page meta
definePageMeta({
  layout: 'default'
})

// State
const activeCategory = ref('videos')
const selectedImage = ref(null)

// Categories
const categories = ref([
  { id: 'videos', title: 'الفيديوهات', icon: 'material-symbols:play-circle' },
  { id: 'services', title: 'الخدمات', icon: 'material-symbols:work' },
  { id: 'destinations', title: 'الوجهات', icon: 'material-symbols:place' },
  { id: 'packages', title: 'الباقات', icon: 'material-symbols:luggage' },
  { id: 'about', title: 'من نحن', icon: 'material-symbols:info' },
  { id: 'logos', title: 'الشعارات', icon: 'material-symbols:image' }
])

// Service Images
const serviceImages = ref([
  { 
    name: 'حجوزات الطيران', 
    image: '/images/home/services/flight_reservations.jpg',
    description: 'خدمة حجز تذاكر الطيران مع أفضل الأسعار'
  },
  { 
    name: 'حجوزات الفنادق', 
    image: '/images/home/services/hotel_reservations.jpg',
    description: 'حجز الفنادق والمنتجعات الفاخرة'
  },
  { 
    name: 'الباقات السياحية', 
    image: '/images/home/services/tour_packages.jpg',
    description: 'باقات سياحية شاملة ومتنوعة'
  },
  { 
    name: 'التأمين السياحي', 
    image: '/images/home/services/travel_insurance.jpg',
    description: 'تأمين شامل لرحلاتك السياحية'
  },
  { 
    name: 'خدمات التأشيرات', 
    image: '/images/home/services/visa_services.jpg',
    description: 'خدمات استخراج التأشيرات'
  },
  { 
    name: 'الرخصة الدولية', 
    image: '/images/home/services/international_driving_license.jpg',
    description: 'استخراج رخصة القيادة الدولية'
  },
  { 
    name: 'الاستشارات السياحية', 
    image: '/images/home/services/tourism_consultation.jpg',
    description: 'استشارات متخصصة لتخطيط رحلاتك'
  },
  { 
    name: 'الدعم 24/7', 
    image: '/images/home/services/support_24_7.jpg',
    description: 'دعم فني متواصل على مدار الساعة'
  }
])

// Global Destinations
const globalDestinations = ref([
  { 
    name: 'باريس', 
    country: 'فرنسا',
    image: '/images/destinations/global/Paris/Paris1.jpeg',
    tags: ['ثقافة', 'فن', 'تاريخ']
  },
  { 
    name: 'لندن', 
    country: 'بريطانيا',
    image: '/images/destinations/global/London/London1.jpeg',
    tags: ['تاريخ', 'ثقافة', 'تسوق']
  },
  { 
    name: 'إسطنبول', 
    country: 'تركيا',
    image: '/images/destinations/global/Istanbul/Istanbul1.jpeg',
    tags: ['تاريخ', 'ثقافة', 'طعام']
  },
  { 
    name: 'القاهرة', 
    country: 'مصر',
    image: '/images/destinations/global/Cairo/Cairo1.jpeg',
    tags: ['تاريخ', 'أهرامات', 'ثقافة']
  },
  { 
    name: 'جورجيا', 
    country: 'جورجيا',
    image: '/images/destinations/global/Georgia/Georgia1.jpeg',
    tags: ['طبيعة', 'جبال', 'ثقافة']
  },
  { 
    name: 'مدريد', 
    country: 'إسبانيا',
    image: '/images/destinations/global/Madrid/Madrid1.jpeg',
    tags: ['ثقافة', 'فن', 'تاريخ']
  }
])

// Saudi Destinations
const saudiDestinations = ref([
  { 
    name: 'الرياض', 
    region: 'منطقة الرياض',
    image: '/images/destinations/saudi/riyadh/main.jpg',
    tags: ['عاصمة', 'ثقافة', 'تسوق']
  },
  { 
    name: 'جدة', 
    region: 'منطقة مكة المكرمة',
    image: '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
    tags: ['بحر', 'تاريخ', 'ثقافة']
  },
  { 
    name: 'العلا', 
    region: 'منطقة المدينة المنورة',
    image: '/images/destinations/saudi/alula/AlUla1.jpeg',
    tags: ['تاريخ', 'آثار', 'طبيعة']
  },
  { 
    name: 'مكة المكرمة', 
    region: 'منطقة مكة المكرمة',
    image: '/images/destinations/saudi/Makkah/Makkah1.jpeg',
    tags: ['دين', 'حج', 'عمرة']
  },
  { 
    name: 'المدينة المنورة', 
    region: 'منطقة المدينة المنورة',
    image: '/images/destinations/saudi/Medina/Medina1.jpeg',
    tags: ['دين', 'تاريخ', 'ثقافة']
  }
])

// Package Images
const packageImages = ref([
  { 
    name: 'باقة باريس الرومانسية', 
    destination: 'باريس، فرنسا',
    image: '/images/packages/london-royal.svg',
    price: '2,500 ريال',
    duration: '5 أيام'
  },
  { 
    name: 'باقة لندن الملكية', 
    destination: 'لندن، بريطانيا',
    image: '/images/packages/london-royal.svg',
    price: '3,000 ريال',
    duration: '7 أيام'
  },
  { 
    name: 'باقة إسطنبول العثمانية', 
    destination: 'إسطنبول، تركيا',
    image: '/images/packages/istanbul-ottoman.svg',
    price: '1,800 ريال',
    duration: '4 أيام'
  },
  { 
    name: 'باقة العلا الأثرية', 
    destination: 'العلا، السعودية',
    image: '/images/packages/alula-archaeological.svg',
    price: '1,200 ريال',
    duration: '3 أيام'
  },
  { 
    name: 'باقة جدة الساحلية', 
    destination: 'جدة، السعودية',
    image: '/images/packages/jeddah-coastal.svg',
    price: '800 ريال',
    duration: '2 أيام'
  },
  { 
    name: 'باقة تايلاند الاستوائية', 
    destination: 'بانكوك، تايلاند',
    image: '/images/packages/thailand-tropical.svg',
    price: '2,200 ريال',
    duration: '6 أيام'
  }
])

// About Images
const aboutImages = ref([
  { 
    name: 'خلفية صفحة من نحن', 
    image: '/images/about/hero-bg.jpeg',
    description: 'صورة خلفية لصفحة من نحن'
  }
])

// Logos
const logos = ref([
  { 
    name: 'شعار الموقع', 
    image: '/images/home/logo/WonderlandLogo.svg',
    description: 'الشعار الرئيسي للموقع'
  },
  { 
    name: 'شعار الموقع الأبيض', 
    image: '/images/home/logo/WonderlandLogoWhite.svg',
    description: 'الشعار الأبيض للموقع'
  }
])

// Methods
const openImageModal = (image: any) => {
  selectedImage.value = image
}

const closeImageModal = () => {
  selectedImage.value = null
}

const downloadImage = (image: any) => {
  const link = document.createElement('a')
  link.href = image.image
  link.download = image.name
  link.click()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// SEO
useHead({
  title: 'معرض الوسائط الشامل | Wonder Land',
  meta: [
    { name: 'description', content: 'عرض جميع الصور والفيديوهات المستخدمة في الموقع مع إمكانية التحميل والمشاهدة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.media-gallery-page {
  min-height: 100vh;
}

.media-section {
  @apply py-16;
}

.section-header {
  @apply text-center mb-12 px-4;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
}

.section-description {
  @apply text-lg text-gray-600 max-w-2xl mx-auto;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #40a0d8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3280ac;
}

/* Modal animations */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
