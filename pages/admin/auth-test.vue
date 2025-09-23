<template>
  <div class="min-h-screen bg-gray-50 p-8" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">اختبار تدفق المصادقة</h1>
        
        <!-- حالة المصادقة الحالية -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">حالة المصادقة الحالية</h2>
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">المستخدم مسجل:</span>
                <span :class="user ? 'text-green-600' : 'text-red-600'" class="mr-2">
                  {{ user ? 'نعم' : 'لا' }}
                </span>
              </div>
              <div>
                <span class="font-medium">صلاحيات الإدارة:</span>
                <span :class="isAdmin ? 'text-green-600' : 'text-red-600'" class="mr-2">
                  {{ isAdmin ? 'نعم' : 'لا' }}
                </span>
              </div>
              <div v-if="user">
                <span class="font-medium">البريد الإلكتروني:</span>
                <span class="mr-2">{{ user.email }}</span>
              </div>
              <div v-if="user">
                <span class="font-medium">الدور:</span>
                <span class="mr-2">{{ user.role }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار الاختبار -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">اختبارات المصادقة</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="testCheckAuth"
              :disabled="loading"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              اختبار التحقق من المصادقة
            </button>
            
            <button
              @click="testRefreshUser"
              :disabled="loading"
              class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              تحديث بيانات المستخدم
            </button>
            
            <button
              @click="testLogout"
              :disabled="loading"
              class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        <!-- نتائج الاختبار -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">نتائج الاختبار</h2>
          <div class="bg-gray-100 rounded-lg p-4">
            <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ testResults }}</pre>
          </div>
        </div>

        <!-- معلومات إضافية -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">معلومات إضافية</h2>
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">Cookie موجود:</span>
                <span class="mr-2">{{ hasToken ? 'نعم' : 'لا' }}</span>
              </div>
              <div>
                <span class="font-medium">حالة التحميل:</span>
                <span class="mr-2">{{ loading ? 'جاري التحميل...' : 'مكتمل' }}</span>
              </div>
              <div>
                <span class="font-medium">الخطأ:</span>
                <span class="mr-2">{{ error || 'لا يوجد' }}</span>
              </div>
              <div>
                <span class="font-medium">الوقت الحالي:</span>
                <span class="mr-2">{{ currentTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- روابط سريعة -->
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            to="/admin/dashboard"
            class="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            الذهاب إلى الداشبورد
          </NuxtLink>
          
          <NuxtLink
            to="/admin/login"
            class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            صفحة تسجيل الدخول
          </NuxtLink>
          
          <button
            @click="refreshPage"
            class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const { user, loading, error, checkAuth, refreshUser, logout, isAdmin } = useAuth()
const testResults = ref('')
const currentTime = ref('')
const hasToken = ref(false)

// تحديث الوقت
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('ar-SA')
}

// تحديث حالة الـ cookie
const updateTokenStatus = () => {
  const tokenCookie = useCookie('auth-token')
  hasToken.value = !!tokenCookie.value
}

// اختبار التحقق من المصادقة
const testCheckAuth = async () => {
  testResults.value = 'جاري اختبار التحقق من المصادقة...\n'
  try {
    const result = await checkAuth()
    testResults.value += `النتيجة: ${result ? 'نجح' : 'فشل'}\n`
    if (result) {
      testResults.value += `المستخدم: ${result.email}\n`
      testResults.value += `الدور: ${result.role}\n`
    }
  } catch (error) {
    testResults.value += `خطأ: ${error.message}\n`
  }
  updateTokenStatus()
}

// اختبار تحديث بيانات المستخدم
const testRefreshUser = async () => {
  testResults.value = 'جاري اختبار تحديث بيانات المستخدم...\n'
  try {
    const result = await refreshUser()
    testResults.value += `النتيجة: ${result ? 'نجح' : 'فشل'}\n`
    if (result) {
      testResults.value += `المستخدم: ${result.email}\n`
      testResults.value += `الدور: ${result.role}\n`
    }
  } catch (error) {
    testResults.value += `خطأ: ${error.message}\n`
  }
  updateTokenStatus()
}

// اختبار تسجيل الخروج
const testLogout = async () => {
  testResults.value = 'جاري اختبار تسجيل الخروج...\n'
  try {
    await logout()
    testResults.value += 'تم تسجيل الخروج بنجاح\n'
  } catch (error) {
    testResults.value += `خطأ: ${error.message}\n`
  }
  updateTokenStatus()
}

// تحديث الصفحة
const refreshPage = () => {
  window.location.reload()
}

// تحديث البيانات عند التحميل
onMounted(() => {
  updateTime()
  updateTokenStatus()
  
  // تحديث الوقت كل ثانية
  setInterval(updateTime, 1000)
  
  // تحديث حالة الـ cookie كل 5 ثوان
  setInterval(updateTokenStatus, 5000)
  
  testResults.value = 'تم تحميل صفحة اختبار المصادقة\n'
  testResults.value += `الوقت: ${currentTime.value}\n`
  testResults.value += `Cookie موجود: ${hasToken.value ? 'نعم' : 'لا'}\n`
})

// SEO
useHead({
  title: 'اختبار المصادقة - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'صفحة اختبار تدفق المصادقة في لوحة التحكم' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
pre {
  font-family: 'Courier New', monospace;
  direction: ltr;
  text-align: left;
}
</style>
