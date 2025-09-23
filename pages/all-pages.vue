<template>
  <div class="all-pages-showcase">
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          جميع صفحات الموقع
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
          عرض شامل لجميع صفحات الموقع مع المحتوى الكامل والتنسيقات
        </p>
      </div>
    </section>

    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-4 py-4">
          <button 
            v-for="page in pages" 
            :key="page.id"
            @click="scrollToPage(page.id)"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="activePage === page.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ page.title }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Pages Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Homepage -->
      <section :id="pages[0].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[0].title }}</h2>
          <p class="page-description">{{ pages[0].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:home" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">الصفحة الرئيسية</p>
                <NuxtLink 
                  to="/" 
                  class="inline-block mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  عرض الصفحة
                </NuxtLink>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">قسم البطل</h4>
                <p class="text-sm text-gray-600">فيديو خلفية مع نص متحرك</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">البحث المتقدم</h4>
                <p class="text-sm text-gray-600">نموذج بحث مع فلاتر</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">الباقات المميزة</h4>
                <p class="text-sm text-gray-600">عرض الباقات السياحية</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">الخدمات</h4>
                <p class="text-sm text-gray-600">8 خدمات رئيسية</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">الوجهات العالمية</h4>
                <p class="text-sm text-gray-600">كاروسيل تفاعلي</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">الوجهات السعودية</h4>
                <p class="text-sm text-gray-600">وجهات داخلية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Page -->
      <section :id="pages[1].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[1].title }}</h2>
          <p class="page-description">{{ pages[1].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:info" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">صفحة من نحن</p>
                <NuxtLink 
                  to="/about" 
                  class="inline-block mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  عرض الصفحة
                </NuxtLink>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-primary-800">قسم البطل</h4>
                <p class="text-sm text-primary-700">صورة خلفية مع عنوان فرعي</p>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold mb-3">نظرة عامة</h4>
                <p class="text-sm text-gray-600">معلومات شاملة عن الوكالة</p>
              </div>
              <div class="bg-gray-800 text-white p-6 rounded-lg">
                <h4 class="font-semibold mb-3">الرسالة والرؤية</h4>
                <p class="text-sm opacity-90">مبادئ الوكالة الأساسية</p>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold mb-3">القيم الأساسية</h4>
                <p class="text-sm text-gray-600">6 قيم أساسية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Packages Pages -->
      <section :id="pages[2].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[2].title }}</h2>
          <p class="page-description">{{ pages[2].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:luggage" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">صفحات الباقات</p>
                <div class="flex gap-2 justify-center mt-4">
                  <NuxtLink 
                    to="/packages" 
                    class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    الباقات
                  </NuxtLink>
                  <NuxtLink 
                    to="/packages/search" 
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    البحث
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-blue-800">صفحة الباقات الرئيسية</h4>
                <p class="text-sm text-blue-700">عرض جميع الباقات مع فلاتر</p>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-green-800">صفحة البحث</h4>
                <p class="text-sm text-green-700">بحث متقدم مع فلاتر متعددة</p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-purple-800">تفاصيل الباقة</h4>
                <p class="text-sm text-purple-700">صفحة تفاصيل كل باقة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Destinations Pages -->
      <section :id="pages[3].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[3].title }}</h2>
          <p class="page-description">{{ pages[3].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:place" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">صفحات الوجهات</p>
                <div class="flex gap-2 justify-center mt-4">
                  <NuxtLink 
                    to="/destinations" 
                    class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    الوجهات
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-orange-800">الوجهات العالمية</h4>
                <p class="text-sm text-orange-700">باريس، لندن، إسطنبول، وغيرها</p>
              </div>
              <div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-red-800">الوجهات السعودية</h4>
                <p class="text-sm text-red-700">الرياض، جدة، العلا، وغيرها</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Admin Pages -->
      <section :id="pages[4].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[4].title }}</h2>
          <p class="page-description">{{ pages[4].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:admin-panel-settings" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">لوحة الإدارة</p>
                <NuxtLink 
                  to="/admin" 
                  class="inline-block mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  عرض لوحة الإدارة
                </NuxtLink>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-blue-800">لوحة التحكم</h4>
                <p class="text-sm text-blue-700">إحصائيات وإدارة عامة</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-green-800">إدارة الباقات</h4>
                <p class="text-sm text-green-700">إضافة وتعديل الباقات</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-purple-800">إدارة الوجهات</h4>
                <p class="text-sm text-purple-700">إدارة الوجهات السياحية</p>
              </div>
              <div class="bg-orange-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-orange-800">إدارة المحتوى</h4>
                <p class="text-sm text-orange-700">نظام CMS متكامل</p>
              </div>
              <div class="bg-red-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-red-800">إدارة الحجوزات</h4>
                <p class="text-sm text-red-700">متابعة الحجوزات</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2 text-gray-800">التقارير</h4>
                <p class="text-sm text-gray-700">تقارير مفصلة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CMS Pages -->
      <section :id="pages[5].id" class="page-section">
        <div class="page-header">
          <h2 class="page-title">{{ pages[5].title }}</h2>
          <p class="page-description">{{ pages[5].description }}</p>
        </div>
        <div class="page-content">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center">
                <Icon name="material-symbols:content-copy" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">نظام إدارة المحتوى</p>
                <NuxtLink 
                  to="/admin/cms" 
                  class="inline-block mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  عرض CMS
                </NuxtLink>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-indigo-800">إدارة الصفحات</h4>
                <p class="text-sm text-indigo-700">إنشاء وتعديل صفحات الموقع</p>
              </div>
              <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-teal-800">إدارة الأقسام</h4>
                <p class="text-sm text-teal-700">أقسام قابلة للتخصيص</p>
              </div>
              <div class="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-pink-800">إدارة المحتوى</h4>
                <p class="text-sm text-pink-700">كتل محتوى مرنة</p>
              </div>
              <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                <h4 class="font-semibold mb-3 text-yellow-800">مكتبة الوسائط</h4>
                <p class="text-sm text-yellow-700">إدارة الصور والفيديوهات</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

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

// Page meta
definePageMeta({
  layout: 'default'
})

// State
const activePage = ref('homepage')

// Pages data
const pages = ref([
  {
    id: 'homepage',
    title: 'الصفحة الرئيسية',
    description: 'الصفحة الرئيسية للموقع مع جميع الأقسام والخدمات'
  },
  {
    id: 'about',
    title: 'صفحة من نحن',
    description: 'معلومات شاملة عن الوكالة ورسالتها ورؤيتها'
  },
  {
    id: 'packages',
    title: 'صفحات الباقات',
    description: 'صفحات عرض الباقات السياحية والبحث'
  },
  {
    id: 'destinations',
    title: 'صفحات الوجهات',
    description: 'صفحات الوجهات السياحية العالمية والمحلية'
  },
  {
    id: 'admin',
    title: 'لوحة الإدارة',
    description: 'لوحة تحكم شاملة لإدارة الموقع'
  },
  {
    id: 'cms',
    title: 'نظام إدارة المحتوى',
    description: 'نظام CMS متكامل لإدارة محتوى الموقع'
  }
])

// Methods
const scrollToPage = (pageId: string) => {
  const element = document.getElementById(pageId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activePage.value = pageId
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Intersection Observer for active page
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
        activePage.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observe all pages
  pages.value.forEach(page => {
    const element = document.getElementById(page.id)
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
  title: 'جميع صفحات الموقع | Wonder Land',
  meta: [
    { name: 'description', content: 'عرض شامل لجميع صفحات الموقع مع المحتوى الكامل والتنسيقات' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.all-pages-showcase {
  min-height: 100vh;
}

.page-section {
  @apply py-16;
}

.page-header {
  @apply text-center mb-12 px-4;
}

.page-title {
  @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
}

.page-description {
  @apply text-lg text-gray-600 max-w-2xl mx-auto;
}

.page-content {
  @apply max-w-6xl mx-auto px-4;
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
