<template>
  <div class="website-showcase-index">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          عرض شامل لموقع Wonder Land
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto mb-8">
          اكتشف جميع أقسام الموقع والصفحات والوسائط مع كامل المحتوى والفيديوهات والصور والتنسيقات
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <button 
            @click="scrollToSection('overview')"
            class="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            ابدأ الاستكشاف
          </button>
          <button 
            @click="scrollToSection('features')"
            class="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            المميزات
          </button>
        </div>
      </div>
    </section>

    <!-- Overview Section -->
    <section id="overview" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            نظرة عامة على الموقع
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            موقع Wonder Land هو وكالة سفر متكاملة تقدم خدمات سياحية شاملة مع نظام إدارة محتوى متطور
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
            <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Icon name="material-symbols:home" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">الصفحة الرئيسية</h3>
            <p class="text-gray-600 mb-6">صفحة رئيسية تفاعلية مع فيديو خلفية وأقسام متعددة</p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• قسم البطل مع فيديو متحرك</li>
              <li>• نموذج بحث متقدم</li>
              <li>• عرض الباقات المميزة</li>
              <li>• قسم الخدمات التفاعلي</li>
              <li>• الوجهات العالمية والمحلية</li>
            </ul>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
            <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
              <Icon name="material-symbols:content-copy" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">نظام إدارة المحتوى</h3>
            <p class="text-gray-600 mb-6">نظام CMS متكامل لإدارة جميع محتويات الموقع</p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• إدارة الصفحات والأقسام</li>
              <li>• مكونات قابلة للتخصيص</li>
              <li>• مكتبة وسائط متكاملة</li>
              <li>• تحرير مباشر للمحتوى</li>
              <li>• دعم متعدد اللغات</li>
            </ul>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
            <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <Icon name="material-symbols:admin-panel-settings" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">لوحة الإدارة</h3>
            <p class="text-gray-600 mb-6">لوحة تحكم شاملة لإدارة جميع جوانب الموقع</p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• إدارة الباقات والوجهات</li>
              <li>• متابعة الحجوزات</li>
              <li>• إحصائيات مفصلة</li>
              <li>• إدارة المستخدمين</li>
              <li>• تقارير شاملة</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            مميزات الموقع
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            تقنيات حديثة وتصميم متطور لضمان أفضل تجربة مستخدم
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center ml-4">
                <Icon name="material-symbols:language" class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">دعم متعدد اللغات</h3>
            </div>
            <p class="text-gray-600 mb-4">دعم كامل للغة العربية والإنجليزية مع تبديل سلس</p>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">العربية</span>
              <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">الإنجليزية</span>
            </div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center ml-4">
                <Icon name="material-symbols:responsive-layout" class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">تصميم متجاوب</h3>
            </div>
            <p class="text-gray-600 mb-4">يعمل بشكل مثالي على جميع الأجهزة والشاشات</p>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">الهاتف</span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">التابلت</span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">سطح المكتب</span>
            </div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center ml-4">
                <Icon name="material-symbols:speed" class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">أداء سريع</h3>
            </div>
            <p class="text-gray-600 mb-4">تحسين متقدم للأداء وسرعة التحميل</p>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">تحسين الصور</span>
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ضغط الملفات</span>
            </div>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center ml-4">
                <Icon name="material-symbols:security" class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">أمان عالي</h3>
            </div>
            <p class="text-gray-600 mb-4">حماية متقدمة لبيانات المستخدمين</p>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">تشفير البيانات</span>
              <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">حماية من الهجمات</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Showcase Pages Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            صفحات العرض الشامل
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            استكشف جميع أقسام الموقع من خلال صفحات العرض المتخصصة
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Icon name="material-symbols:view-module" class="h-16 w-16 text-white" />
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">عرض جميع الأقسام</h3>
              <p class="text-gray-600 mb-6">عرض شامل لجميع أقسام الصفحة الرئيسية والصفحات الأخرى</p>
              <NuxtLink 
                to="/showcase"
                class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                عرض الصفحة
              </NuxtLink>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Icon name="material-symbols:pages" class="h-16 w-16 text-white" />
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">جميع صفحات الموقع</h3>
              <p class="text-gray-600 mb-6">عرض جميع صفحات الموقع مع وصف مفصل لكل صفحة</p>
              <NuxtLink 
                to="/all-pages"
                class="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                عرض الصفحة
              </NuxtLink>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Icon name="material-symbols:photo-library" class="h-16 w-16 text-white" />
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">معرض الوسائط</h3>
              <p class="text-gray-600 mb-6">عرض جميع الصور والفيديوهات مع إمكانية التحميل</p>
              <NuxtLink 
                to="/media-gallery"
                class="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
              >
                عرض المعرض
              </NuxtLink>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Icon name="material-symbols:bug-report" class="h-16 w-16 text-white" />
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">اختبار المكونات</h3>
              <p class="text-gray-600 mb-6">صفحة اختبار للتأكد من عمل جميع المكونات</p>
              <NuxtLink 
                to="/test-components"
                class="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                اختبار المكونات
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Access Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            الوصول السريع
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            روابط سريعة للوصول إلى الصفحات الرئيسية في الموقع
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink 
            to="/"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:home" class="h-12 w-12 text-primary-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">الرئيسية</h3>
            <p class="text-sm text-gray-600">الصفحة الرئيسية</p>
          </NuxtLink>

          <NuxtLink 
            to="/about"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:info" class="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">من نحن</h3>
            <p class="text-sm text-gray-600">معلومات عن الوكالة</p>
          </NuxtLink>

          <NuxtLink 
            to="/packages"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:luggage" class="h-12 w-12 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">الباقات</h3>
            <p class="text-sm text-gray-600">الباقات السياحية</p>
          </NuxtLink>

          <NuxtLink 
            to="/destinations"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:place" class="h-12 w-12 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">الوجهات</h3>
            <p class="text-sm text-gray-600">الوجهات السياحية</p>
          </NuxtLink>

          <NuxtLink 
            to="/admin"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:admin-panel-settings" class="h-12 w-12 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">لوحة الإدارة</h3>
            <p class="text-sm text-gray-600">إدارة الموقع</p>
          </NuxtLink>

          <NuxtLink 
            to="/admin/cms"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:content-copy" class="h-12 w-12 text-indigo-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">نظام المحتوى</h3>
            <p class="text-sm text-gray-600">إدارة المحتوى</p>
          </NuxtLink>

          <NuxtLink 
            to="/packages/search"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:search" class="h-12 w-12 text-teal-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">البحث</h3>
            <p class="text-sm text-gray-600">البحث في الباقات</p>
          </NuxtLink>

          <NuxtLink 
            to="/contact"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:contact-mail" class="h-12 w-12 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">اتصل بنا</h3>
            <p class="text-sm text-gray-600">معلومات التواصل</p>
          </NuxtLink>

          <NuxtLink 
            to="/test-components"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:bug-report" class="h-12 w-12 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">اختبار المكونات</h3>
            <p class="text-sm text-gray-600">اختبار عمل المكونات</p>
          </NuxtLink>

          <NuxtLink 
            to="/showcase"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:view-module" class="h-12 w-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">عرض الأقسام</h3>
            <p class="text-sm text-gray-600">عرض جميع الأقسام</p>
          </NuxtLink>

          <NuxtLink 
            to="/all-pages"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:pages" class="h-12 w-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">جميع الصفحات</h3>
            <p class="text-sm text-gray-600">عرض جميع الصفحات</p>
          </NuxtLink>

          <NuxtLink 
            to="/media-gallery"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <Icon name="material-symbols:photo-library" class="h-12 w-12 text-violet-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-gray-900 mb-2">معرض الوسائط</h3>
            <p class="text-sm text-gray-600">معرض الصور والفيديوهات</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl font-bold mb-4">Wonder Land Travel Agency</h3>
        <p class="text-gray-400 mb-6">وكالة السفر الرائدة في المملكة العربية السعودية</p>
        <div class="flex justify-center gap-6">
          <NuxtLink to="/showcase" class="text-gray-400 hover:text-white transition-colors">عرض الأقسام</NuxtLink>
          <NuxtLink to="/all-pages" class="text-gray-400 hover:text-white transition-colors">جميع الصفحات</NuxtLink>
          <NuxtLink to="/media-gallery" class="text-gray-400 hover:text-white transition-colors">معرض الوسائط</NuxtLink>
        </div>
        <p class="text-gray-500 mt-6 text-sm">© 2024 Wonder Land. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  layout: 'default'
})

// Methods
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// SEO
useHead({
  title: 'عرض شامل لموقع Wonder Land | فهرس الموقع',
  meta: [
    { name: 'description', content: 'عرض شامل لجميع أقسام موقع Wonder Land مع كامل المحتوى والفيديوهات والصور والتنسيقات' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.website-showcase-index {
  min-height: 100vh;
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

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Gradient animations */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
