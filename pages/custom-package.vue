<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            صمم باقتك المثالية
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            هل تريد تخصيص هذه الباقة أو إنشاء باقة خاصة بك؟ خبراء السفر لدينا هنا لمساعدتك في تخطيط عطلتك المثالية.
          </p>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="showContactForm = true"
            class="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <Icon name="material-symbols:chat" class="h-6 w-6" />
            تواصل مع خبير السفر
          </button>
          <a 
            :href="getWhatsAppUrl('أريد الاستفسار عن تصميم باقة سياحية مخصصة')"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#128C7E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <Icon name="logos:whatsapp-icon" class="w-6 h-6" />
            واتساب مباشر
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            لماذا تختار خدماتنا المخصصة؟
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن نقدم تجربة سفر فريدة ومصممة خصيصاً لاحتياجاتك
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:person-outline" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">استشارة شخصية</h3>
            <p class="text-gray-600">
              خبراء السفر لدينا سيتواصلون معك مباشرة لفهم احتياجاتك وتصميم رحلة تناسبك تماماً
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:schedule" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">مرونة في التوقيت</h3>
            <p class="text-gray-600">
              اختر التواريخ التي تناسبك، وسنقوم بتعديل البرنامج ليتوافق مع جدولك الزمني
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:attach-money" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">أسعار تنافسية</h3>
            <p class="text-gray-600">
              نحصل على أفضل الأسعار من الفنادق والشركات المحلية لضمان حصولك على أفضل قيمة مقابل المال
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:location-on" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">وجهات متنوعة</h3>
            <p class="text-gray-600">
              من الوجهات المحلية إلى العالمية، لدينا خبرة واسعة في تنظيم رحلات إلى جميع أنحاء العالم
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:support-agent" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">دعم 24/7</h3>
            <p class="text-gray-600">
              فريق الدعم متاح على مدار الساعة لمساعدتك في أي استفسار أو طوارئ أثناء رحلتك
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="material-symbols:verified" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">ضمان الجودة</h3>
            <p class="text-gray-600">
              نضمن لك تجربة سفر استثنائية مع مراجعة مستمرة لجميع الخدمات المقدمة
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            كيف نعمل معك؟
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            عملية بسيطة ومباشرة لتصميم رحلتك المثالية
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <!-- Step 1 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">تواصل معنا</h3>
            <p class="text-gray-600">
              اتصل بنا أو أرسل رسالة عبر النموذج أو الواتساب
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">استشارة مجانية</h3>
            <p class="text-gray-600">
              نناقش احتياجاتك والميزانية والتفضيلات
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">تصميم البرنامج</h3>
            <p class="text-gray-600">
              نعد لك برنامجاً مفصلاً مع الأسعار والتفاصيل
            </p>
          </div>

          <!-- Step 4 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">4</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">الحجز والتنفيذ</h3>
            <p class="text-gray-600">
              ننفذ الحجوزات ونضمن لك رحلة لا تُنسى
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Modal -->
    <ContactForm v-model="showContactForm" />

    <!-- Final CTA Section -->
    <section class="py-20 px-4 bg-gradient-to-r from-primary to-primary-dark">
      <div class="max-w-4xl mx-auto text-center text-white">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          ابدأ رحلتك المثالية اليوم
        </h2>
        <p class="text-xl mb-8 opacity-90">
          لا تنتظر أكثر، تواصل معنا الآن واحصل على عرض مخصص لرحلتك
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="showContactForm = true"
            class="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Icon name="material-symbols:chat" class="h-6 w-6" />
            ابدأ الآن
          </button>
          <a 
            :href="getWhatsAppUrl('أريد الاستفسار عن تصميم باقة سياحية مخصصة')"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#128C7E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Icon name="logos:whatsapp-icon" class="w-6 h-6" />
            واتساب
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWhatsApp } from '~/composables/useWhatsApp'

// SEO
useHead({
  title: 'صمم باقتك المثالية - وكالة السفر',
  meta: [
    { name: 'description', content: 'هل تريد تخصيص هذه الباقة أو إنشاء باقة خاصة بك؟ خبراء السفر لدينا هنا لمساعدتك في تخطيط عطلتك المثالية.' },
    { name: 'keywords', content: 'باقة سياحية مخصصة, تصميم رحلة, وكالة سفر, استشارة سفر' }
  ]
})

const showContactForm = ref(false)
const { getWhatsAppUrl } = useWhatsApp()
</script>
