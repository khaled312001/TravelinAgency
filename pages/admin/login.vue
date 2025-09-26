<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
    <!-- خلفية متحركة -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <!-- شعار الموقع -->
        <div class="text-center mb-8">
          <div class="mx-auto h-24 w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Icon name="material-symbols:admin-panel-settings" class="h-12 w-12 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            لوحة تحكم الإدارة
          </h2>
          <p class="text-gray-300 text-lg">
            تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        <!-- نموذج تسجيل الدخول -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-white mb-3">
              البريد الإلكتروني
            </label>
            <div class="relative group">
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                required
                class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 pr-12 text-white placeholder-gray-300 backdrop-blur-sm"
                placeholder="أدخل البريد الإلكتروني"
                :disabled="loading"
              />
              <Icon name="material-symbols:mail-outline" class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-purple-400 transition-colors" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-white mb-3">
              كلمة المرور
            </label>
            <div class="relative group">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 pr-12 pl-12 text-white placeholder-gray-300 backdrop-blur-sm"
                placeholder="أدخل كلمة المرور"
                :disabled="loading"
              />
              <Icon name="material-symbols:lock-outline" class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-purple-400 transition-colors" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                :disabled="loading"
              >
                <Icon :name="showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- رسائل الخطأ -->
          <div v-if="error" class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div class="flex items-center">
              <Icon name="material-symbols:error-outline" class="h-5 w-5 text-red-300 ml-2" />
              <p class="text-sm text-red-200">{{ error }}</p>
            </div>
          </div>

          <!-- زر تسجيل الدخول -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Icon v-if="loading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
            <span class="text-lg">{{ loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول' }}</span>
          </button>
        </form>

        <!-- روابط إضافية -->
        <div class="mt-8 text-center">
          <NuxtLink to="/" class="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors group">
            <Icon name="material-symbols:arrow-back" class="h-4 w-4 ml-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            العودة إلى الموقع الرئيسي
          </NuxtLink>
        </div>
      </div>

      <!-- معلومات إضافية -->
      <div class="text-center">
        <p class="text-sm text-white/60">
          © 2025 Wonder Land Traveling Agency
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: false,
  title: 'تسجيل دخول الإدارة'
})

// المتغيرات التفاعلية
const loginForm = ref({
  email: 'admin@wonderland.com', // Default admin email
  password: 'admin123' // Default admin password
})

const showPassword = ref(false)

// Authentication
const { user, login, loading, error } = useAuth()

// التحقق من تسجيل الدخول المسبق
const hasCheckedInitialAuth = ref(false)

onMounted(async () => {
  // Check if there's a token cookie first to avoid unnecessary API calls
  const tokenCookie = useCookie('auth-token')
  
  if (tokenCookie.value) {
    // Only check auth if there's a token
    const { checkAuth } = useAuth()
    try {
      const currentUser = await checkAuth(true) // Use silent mode to reduce console noise
      if (currentUser && currentUser.role && ['admin', 'super_admin', 'moderator'].includes(currentUser.role)) {
        // Only redirect if user is actually an admin
        console.log('User is already authenticated as admin, redirecting to dashboard')
        await navigateTo('/admin/dashboard')
        return // Exit early to prevent further processing
      }
    } catch (error) {
      // User is not authenticated, stay on login page
      console.log('User not authenticated, staying on login page')
    }
  } else {
    // No token, user is definitely not authenticated - this is normal for login page
  }
  
  // Mark that we've checked initial auth after a short delay
  setTimeout(() => {
    hasCheckedInitialAuth.value = true
  }, 500)
})

watchEffect(() => {
  // Only redirect if user state changes after initial auth check
  if (hasCheckedInitialAuth.value && user.value && user.value.role && ['admin', 'super_admin', 'moderator'].includes(user.value.role)) {
    console.log('User state changed to admin after login, redirecting to dashboard')
    navigateTo('/admin/dashboard')
  }
})

// دالة تسجيل الدخول
const handleLogin = async () => {
  const result = await login(loginForm.value.email, loginForm.value.password)
  
  if (result.success) {
    await navigateTo('/admin/dashboard')
  }
  // Error handling is done in the composable
}

// SEO والميتا
useHead({
  title: 'تسجيل دخول الإدارة - Wonder Land',
  meta: [
    { name: 'description', content: 'صفحة تسجيل دخول لوحة تحكم الإدارة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
/* تحسينات إضافية للتصميم */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

input:focus {
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

button:focus {
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

/* أنيميشن الخلفية المتحركة */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* تأثيرات إضافية */
.group:hover .group-hover\:transform {
  transform: translateX(-4px);
}

/* تحسين النص الشفاف */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
