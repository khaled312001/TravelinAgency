<template>
  <div class="showcase-page">
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          عرض شامل لجميع أقسام الموقع
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
          اكتشف جميع أقسام الصفحة الرئيسية والصفحات الأخرى مع كامل المحتوى والفيديوهات والصور والتنسيقات
        </p>
      </div>
    </section>

    <!-- Navigation Menu -->
    <section class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <nav class="flex flex-wrap justify-center gap-4 py-4">
          <button 
            v-for="section in sections" 
            :key="section.id"
            @click="scrollToSection(section.id)"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="activeSection === section.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ section.title }}
          </button>
        </nav>
      </div>
    </section>

    <!-- Original Homepage Sections -->
    <section id="hero-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">قسم البطل الرئيسي (Hero Section)</h2>
        <p class="section-description">قسم البطل مع فيديو خلفية متحرك ونص متغير</p>
      </div>
      <div class="section-content">
        <HeroSection 
          @scroll-to-packages="() => {}"
          @scroll-to-search="() => {}"
        />
      </div>
    </section>

    <section id="search-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">قسم البحث المتقدم (Search Section)</h2>
        <p class="section-description">نموذج بحث متقدم مع فلاتر للوجهات والفترة والميزانية</p>
      </div>
      <div class="section-content">
        <SearchSection />
      </div>
    </section>

    <section id="packages-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">الباقات المميزة (Featured Packages)</h2>
        <p class="section-description">عرض الباقات السياحية المميزة مع بطاقات تفاعلية</p>
      </div>
      <div class="section-content">
        <FeaturedPackages />
      </div>
    </section>

    <section id="services-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">قسم الخدمات (Services Section)</h2>
        <p class="section-description">عرض جميع خدمات الوكالة مع صور خلفية وتأثيرات بصرية</p>
      </div>
      <div class="section-content">
        <ServicesSection />
      </div>
    </section>

    <section id="global-destinations" class="section-container">
      <div class="section-header">
        <h2 class="section-title">الوجهات العالمية (Global Destinations)</h2>
        <p class="section-description">عرض الوجهات السياحية العالمية مع كاروسيل تفاعلي</p>
      </div>
      <div class="section-content">
        <GlobalDestinations />
      </div>
    </section>

    <section id="saudi-destinations" class="section-container">
      <div class="section-header">
        <h2 class="section-title">الوجهات السعودية (Saudi Destinations)</h2>
        <p class="section-description">عرض الوجهات السياحية داخل المملكة العربية السعودية</p>
      </div>
      <div class="section-content">
        <SaudiDestinations />
      </div>
    </section>

    <!-- About Page Sections -->
    <section id="about-hero" class="section-container">
      <div class="section-header">
        <h2 class="section-title">صفحة من نحن - قسم البطل</h2>
        <p class="section-description">قسم البطل لصفحة من نحن مع صورة خلفية</p>
      </div>
      <div class="section-content">
        <AboutHeroSection
          title="about.hero.title"
          subtitle="about.hero.subtitle"
          cta="about.hero.cta"
          backgroundImage="/images/about/hero-bg.jpeg"
        />
      </div>
    </section>

    <section id="agency-overview" class="section-container">
      <div class="section-header">
        <h2 class="section-title">نظرة عامة على الوكالة</h2>
        <p class="section-description">معلومات شاملة عن الوكالة ومميزاتها</p>
      </div>
      <div class="section-content">
        <AgencyOverview />
      </div>
    </section>

    <section id="mission-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">الرسالة والرؤية</h2>
        <p class="section-description">رسالة ورؤية الوكالة مع تصميم داكن</p>
      </div>
      <div class="section-content">
        <AboutMissionSection />
      </div>
    </section>

    <section id="values-section" class="section-container">
      <div class="section-header">
        <h2 class="section-title">القيم الأساسية</h2>
        <p class="section-description">القيم والمبادئ التي تتبعها الوكالة</p>
      </div>
      <div class="section-content">
        <CoreValuesGrid />
      </div>
    </section>

    <!-- CMS Components Showcase -->
    <section id="cms-showcase" class="section-container">
      <div class="section-header">
        <h2 class="section-title">مكونات نظام إدارة المحتوى (CMS)</h2>
        <p class="section-description">عرض مكونات CMS القابلة للتخصيص</p>
      </div>
      <div class="section-content space-y-16">
        <!-- CMS Hero Example -->
        <div class="cms-component">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">CMS Hero Component</h3>
          <CMSHero :section="cmsHeroSection" />
        </div>

        <!-- CMS About Example -->
        <div class="cms-component">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">CMS About Component</h3>
          <CMSAbout :section="cmsAboutSection" />
        </div>

        <!-- CMS Services Example -->
        <div class="cms-component">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">CMS Services Component</h3>
          <CMSServices :section="cmsServicesSection" />
        </div>
      </div>
    </section>

    <!-- Media Gallery -->
    <section id="media-gallery" class="section-container">
      <div class="section-header">
        <h2 class="section-title">معرض الوسائط</h2>
        <p class="section-description">عرض الصور والفيديوهات المستخدمة في الموقع</p>
      </div>
      <div class="section-content">
        <!-- Hero Videos -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">فيديوهات قسم البطل</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h4 class="text-lg font-semibold mb-4">فيديو سطح المكتب</h4>
              <video 
                class="w-full rounded-lg"
                controls
                poster="/images/home/heroSection/hero-image.webp"
              >
                <source src="/videos/hero/desktop/hero-desktop.webm" type="video/webm">
                <source src="/videos/hero/desktop/hero-desktop.mp4" type="video/mp4">
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h4 class="text-lg font-semibold mb-4">فيديو الهاتف المحمول</h4>
              <video 
                class="w-full rounded-lg"
                controls
                poster="/images/home/heroSection/hero-image.webp"
              >
                <source src="/videos/hero/mobile/hero-mobile-center.webm" type="video/webm">
                <source src="/videos/hero/mobile/hero-mobile-center.mp4" type="video/mp4">
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
          </div>
        </div>

        <!-- Service Images -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">صور الخدمات</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              v-for="service in serviceImages" 
              :key="service.name"
              class="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img 
                :src="service.image" 
                :alt="service.name"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h4 class="font-semibold text-gray-800">{{ service.name }}</h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Destination Images -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">صور الوجهات</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="destination in destinationImages" 
              :key="destination.name"
              class="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img 
                :src="destination.image" 
                :alt="destination.name"
                class="w-full h-64 object-cover"
              />
              <div class="p-4">
                <h4 class="font-semibold text-gray-800">{{ destination.name }}</h4>
                <p class="text-sm text-gray-600">{{ destination.country }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Styling Showcase -->
    <section id="styling-showcase" class="section-container">
      <div class="section-header">
        <h2 class="section-title">عرض التنسيقات والتصميم</h2>
        <p class="section-description">عرض الألوان والخطوط والتأثيرات المستخدمة في الموقع</p>
      </div>
      <div class="section-content">
        <!-- Color Palette -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">لوحة الألوان</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-primary-50 p-4 rounded-lg text-center">
              <div class="w-16 h-16 bg-primary-50 rounded-lg mx-auto mb-2 border-2 border-primary-200"></div>
              <p class="text-sm font-medium">Primary 50</p>
            </div>
            <div class="bg-primary-100 p-4 rounded-lg text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-2 border-2 border-primary-200"></div>
              <p class="text-sm font-medium">Primary 100</p>
            </div>
            <div class="bg-primary-500 p-4 rounded-lg text-center">
              <div class="w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-2"></div>
              <p class="text-sm font-medium text-white">Primary 500</p>
            </div>
            <div class="bg-primary-900 p-4 rounded-lg text-center">
              <div class="w-16 h-16 bg-primary-900 rounded-lg mx-auto mb-2"></div>
              <p class="text-sm font-medium text-white">Primary 900</p>
            </div>
          </div>
        </div>

        <!-- Typography -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">الخطوط والنصوص</h3>
          <div class="space-y-4">
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">عنوان رئيسي كبير</h1>
              <h2 class="text-3xl font-bold text-gray-800 mb-2">عنوان رئيسي متوسط</h2>
              <h3 class="text-2xl font-semibold text-gray-700 mb-2">عنوان فرعي</h3>
              <h4 class="text-xl font-medium text-gray-600 mb-2">عنوان صغير</h4>
              <p class="text-lg text-gray-600 mb-2">نص عادي بحجم كبير</p>
              <p class="text-base text-gray-600 mb-2">نص عادي بحجم متوسط</p>
              <p class="text-sm text-gray-500">نص صغير</p>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">الأزرار</h3>
          <div class="flex flex-wrap gap-4">
            <button class="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              زر أساسي
            </button>
            <button class="bg-white text-primary-500 border-2 border-primary-500 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              زر ثانوي
            </button>
            <button class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              زر محايد
            </button>
            <button class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
              زر تحذير
            </button>
          </div>
        </div>

        <!-- Cards -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">البطاقات</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h4 class="text-xl font-semibold mb-3">بطاقة عادية</h4>
              <p class="text-gray-600">مثال على بطاقة عادية مع تأثير hover</p>
            </div>
            <div class="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl shadow-lg p-6">
              <h4 class="text-xl font-semibold mb-3">بطاقة متدرجة</h4>
              <p class="opacity-90">مثال على بطاقة بخلفية متدرجة</p>
            </div>
            <div class="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h4 class="text-xl font-semibold mb-3 text-primary-600">بطاقة محاطة</h4>
              <p class="text-gray-600">مثال على بطاقة مع حدود ملونة</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors z-50"
    >
      <Icon name="material-symbols:keyboard-arrow-up" class="h-6 w-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '~/components/HomeSections/HeroSection.vue'
import SearchSection from '~/components/HomeSections/searchSection.vue'
import FeaturedPackages from '~/components/HomeSections/featuredPackages.vue'
import ServicesSection from '~/components/HomeSections/servicesSection.vue'
import GlobalDestinations from '~/components/HomeSections/globalDestinations.vue'
import SaudiDestinations from '~/components/HomeSections/saudiDestinations.vue'
import AboutHeroSection from '~/components/ui/about/AboutHeroSection.vue'
import AgencyOverview from '~/components/ui/about/AgencyOverview.vue'
import AboutMissionSection from '~/components/ui/about/AboutMissionSection.vue'
import CoreValuesGrid from '~/components/ui/about/CoreValuesGrid.vue'
import CMSHero from '~/components/cms/CMSHero.vue'
import CMSAbout from '~/components/cms/CMSAbout.vue'
import CMSServices from '~/components/cms/CMSServices.vue'

// Page meta
definePageMeta({
  layout: 'default'
})

// State
const activeSection = ref('hero-section')

// Sections for navigation
const sections = ref([
  { id: 'hero-section', title: 'قسم البطل' },
  { id: 'search-section', title: 'البحث' },
  { id: 'packages-section', title: 'الباقات' },
  { id: 'services-section', title: 'الخدمات' },
  { id: 'global-destinations', title: 'الوجهات العالمية' },
  { id: 'saudi-destinations', title: 'الوجهات السعودية' },
  { id: 'about-hero', title: 'من نحن - البطل' },
  { id: 'agency-overview', title: 'نظرة عامة' },
  { id: 'mission-section', title: 'الرسالة والرؤية' },
  { id: 'values-section', title: 'القيم' },
  { id: 'cms-showcase', title: 'نظام المحتوى' },
  { id: 'media-gallery', title: 'معرض الوسائط' },
  { id: 'styling-showcase', title: 'التنسيقات' }
])

// CMS Section Examples
const cmsHeroSection = ref({
  id: 1,
  section_type: 'hero',
  title: 'مرحباً بك في عالم العجائب',
  subtitle: 'اكتشف أفضل الوجهات السياحية معنا',
  content: 'نحن نقدم لك تجارب سفر لا تُنسى',
  background_color: '#1e40af',
  background_image: '/images/home/heroSection/hero-image.webp',
  text_color: '#ffffff',
  content_blocks: [
    {
      id: 1,
      block_type: 'button',
      link_url: '/packages',
      link_text: 'اكتشف الباقات'
    }
  ],
  settings: {
    video_background: false
  }
})

const cmsAboutSection = ref({
  id: 2,
  section_type: 'about',
  title: 'من نحن',
  subtitle: 'وكالة السفر الرائدة في المملكة',
  content: 'نحن نقدم أفضل الخدمات السياحية',
  background_color: '#ffffff',
  text_color: '#000000',
  content_blocks: [
    {
      id: 1,
      block_type: 'feature',
      title: 'خبرة 15 عام',
      content: 'خبرة واسعة في مجال السياحة والسفر',
      image_url: '/images/home/services/flight_reservations.jpg'
    },
    {
      id: 2,
      block_type: 'stat',
      title: '10,000+',
      content: 'عميل راضي'
    }
  ]
})

const cmsServicesSection = ref({
  id: 3,
  section_type: 'services',
  title: 'خدماتنا',
  subtitle: 'نقدم لك أفضل الخدمات السياحية',
  content: 'خدمات شاملة ومتكاملة',
  background_color: '#f8fafc',
  text_color: '#000000',
  content_blocks: [
    {
      id: 1,
      block_type: 'service',
      title: 'حجوزات الطيران',
      content: 'أفضل أسعار تذاكر الطيران',
      image_url: '/images/home/services/flight_reservations.jpg',
      link_url: '/packages',
      link_text: 'احجز الآن'
    },
    {
      id: 2,
      block_type: 'service',
      title: 'حجوزات الفنادق',
      content: 'فنادق فاخرة في جميع أنحاء العالم',
      image_url: '/images/home/services/hotel_reservations.jpg',
      link_url: '/packages',
      link_text: 'احجز الآن'
    }
  ],
  settings: {
    cta: {
      title: 'هل تريد معرفة المزيد؟',
      description: 'تواصل معنا للحصول على أفضل الخدمات',
      link: '/contact',
      button_text: 'تواصل معنا'
    }
  }
})

// Media data
const serviceImages = ref([
  { name: 'حجوزات الطيران', image: '/images/home/services/flight_reservations.jpg' },
  { name: 'حجوزات الفنادق', image: '/images/home/services/hotel_reservations.jpg' },
  { name: 'الباقات السياحية', image: '/images/home/services/tour_packages.jpg' },
  { name: 'التأمين السياحي', image: '/images/home/services/travel_insurance.jpg' },
  { name: 'خدمات التأشيرات', image: '/images/home/services/visa_services.jpg' },
  { name: 'الرخصة الدولية', image: '/images/home/services/international_driving_license.jpg' },
  { name: 'الاستشارات السياحية', image: '/images/home/services/tourism_consultation.jpg' },
  { name: 'الدعم 24/7', image: '/images/home/services/support_24_7.jpg' }
])

const destinationImages = ref([
  { name: 'باريس', country: 'فرنسا', image: '/images/destinations/global/Paris/Paris1.jpeg' },
  { name: 'لندن', country: 'بريطانيا', image: '/images/destinations/global/London/London1.jpeg' },
  { name: 'إسطنبول', country: 'تركيا', image: '/images/destinations/global/Istanbul/Istanbul1.jpeg' },
  { name: 'الرياض', country: 'السعودية', image: '/images/destinations/saudi/riyadh/main.jpg' },
  { name: 'جدة', country: 'السعودية', image: '/images/destinations/saudi/jeddah/Jeddah1.jpeg' },
  { name: 'العلا', country: 'السعودية', image: '/images/destinations/saudi/alula/AlUla1.jpeg' }
])

// Methods
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Intersection Observer for active section
const observerOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observe all sections
  sections.value.forEach(section => {
    const element = document.getElementById(section.id)
    if (element && observer) {
      observer.observe(element)
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// SEO
useHead({
  title: 'عرض شامل - جميع أقسام الموقع | Wonder Land',
  meta: [
    { name: 'description', content: 'عرض شامل لجميع أقسام الصفحة الرئيسية والصفحات الأخرى مع كامل المحتوى والفيديوهات والصور والتنسيقات' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.showcase-page {
  min-height: 100vh;
}

.section-container {
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

.section-content {
  @apply max-w-7xl mx-auto px-4;
}

.cms-component {
  @apply bg-gray-50 rounded-xl p-8;
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
</style>
