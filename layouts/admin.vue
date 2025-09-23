<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 flex" dir="rtl">
    <!-- شريط علوي -->
    <header class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500/90 backdrop-blur-lg shadow-md border-b border-pink-200/70 fixed w-full top-0 z-40">
      <div class="flex items-center justify-between h-16 px-6">
        <!-- زر القائمة الجانبية (للجوال) -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="md:hidden p-2 rounded-lg text-white hover:text-pink-100 hover:bg-pink-400/30 transition-all duration-200"
        >
          <Icon name="material-symbols:menu" class="h-6 w-6" />
        </button>

        <!-- شعار وعنوان -->
        <div class="flex items-center">
          <div class="h-8 w-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center ml-3 shadow-lg">
            <Icon name="material-symbols:admin-panel-settings" class="h-5 w-5 text-white" />
          </div>
          <h1 class="text-xl font-bold text-white drop-shadow">لوحة تحكم الإدارة</h1>
        </div>

        <!-- معلومات المستخدم -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- زر زيارة الموقع -->
          <button
            @click="visitWebsite"
            class="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-white hover:text-pink-100 hover:bg-pink-400/30 transition-all duration-200 border border-pink-200/60 hover:border-pink-300/60"
            title="زيارة الموقع"
          >
            <Icon name="material-symbols:open-in-new" class="h-4 w-4" />
            <span class="hidden md:block text-sm font-medium">زيارة الموقع</span>
          </button>
          
          <!-- الإشعارات -->
          <AdminNotificationDropdown />

          <!-- قائمة المستخدم -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center space-x-2 space-x-reverse p-2 rounded-lg text-white hover:text-pink-100 hover:bg-pink-400/30 transition-all duration-200"
            >
              <div class="h-8 w-8 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <Icon name="material-symbols:person-outline" class="h-5 w-5 text-white" />
              </div>
              <span class="hidden md:block font-medium text-white/90">{{ userEmail }}</span>
              <Icon name="material-symbols:keyboard-arrow-down" class="h-4 w-4 text-pink-100" />
            </button>

            <!-- قائمة منسدلة -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute left-0 mt-2 w-48 bg-gradient-to-br from-white via-pink-50 to-purple-100/95 backdrop-blur-sm rounded-xl shadow-xl border border-pink-200/60 py-1 z-50"
              >
                <NuxtLink to="/admin/profile" class="flex items-center px-4 py-2 text-sm text-pink-700 hover:bg-pink-100/80 transition-colors">
                  <Icon name="material-symbols:person-outline" class="h-4 w-4 ml-2 text-pink-500" />
                  الملف الشخصي
                </NuxtLink>
                <NuxtLink to="/admin/settings" class="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-100/80 transition-colors">
                  <Icon name="material-symbols:settings-outline" class="h-4 w-4 ml-2 text-purple-500" />
                  الإعدادات
                </NuxtLink>
                <hr class="my-1 border-pink-200/60" />
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100/80 transition-colors"
                >
                  <Icon name="material-symbols:logout" class="h-4 w-4 ml-2 text-red-500" />
                  تسجيل الخروج
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- القائمة الجانبية -->
    <aside
      :class="[
        'fixed inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-pink-200 via-purple-100 to-blue-100/95 backdrop-blur-lg shadow-2xl border-l border-pink-200/70 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 md:flex-shrink-0',
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <!-- خلفية للجوال -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="md:hidden fixed inset-0 bg-pink-400/40 backdrop-blur-sm z-40"
      ></div>

      <!-- محتوى القائمة الجانبية -->
      <div class="flex flex-col h-full pt-16 md:pt-16 relative z-50 bg-gradient-to-b from-pink-200 via-purple-100 to-blue-100/95 backdrop-blur-lg transition-colors duration-500">
        <!-- شعار (للجوال فقط) -->
        <div class="md:hidden p-6 border-b border-none">
          <div class="flex items-center animate-fade-in-down">
            <div class="h-12 w-12 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center ml-3 shadow-2xl transition-all duration-500 hover:scale-110">
              <Icon name="material-symbols:admin-panel-settings" class="h-7 w-7 text-white drop-shadow-xl animate-pulse" />
            </div>
            <h2 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-pink-700 to-purple-800 ml-2 transition-colors duration-500 animate-fade-in">
              لوحة التحكم
            </h2>
          </div>
        </div>

        <!-- قائمة التنقل -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NuxtLink
            to="/admin/dashboard"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/admin/dashboard' }"
          >
            <Icon name="material-symbols:dashboard-outline" class="nav-icon" />
            <span>لوحة المعلومات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/content"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/content') }"
          >
            <Icon name="material-symbols:description-outline" class="nav-icon" />
            <span>إدارة المحتوى</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/packages"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/packages') }"
          >
            <Icon name="material-symbols:package-2-outline" class="nav-icon" />
            <span>إدارة الباقات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/destinations"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/destinations') }"
          >
            <Icon name="material-symbols:location-on-outline" class="nav-icon" />
            <span>إدارة الوجهات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/bookings"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/bookings') }"
          >
            <Icon name="material-symbols:book-online-outline" class="nav-icon" />
            <span>الحجوزات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/contacts"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/contacts') }"
          >
            <Icon name="material-symbols:contact-mail-outline" class="nav-icon" />
            <span>رسائل التواصل</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/notifications"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/notifications') }"
          >
            <Icon name="material-symbols:notifications-outline" class="nav-icon" />
            <span>الإشعارات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/users') }"
          >
            <Icon name="material-symbols:group-outline" class="nav-icon" />
            <span>إدارة المستخدمين</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/reports"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/reports') }"
          >
            <Icon name="material-symbols:analytics-outline" class="nav-icon" />
            <span>التقارير والإحصائيات</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/seo') }"
          >
            <Icon name="material-symbols:search" class="nav-icon" />
            <span>إدارة SEO</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/admin/settings') }"
          >
            <Icon name="material-symbols:settings-outline" class="nav-icon" />
            <span>الإعدادات</span>
          </NuxtLink>
        </nav>

        <!-- معلومات إضافية -->
        <div class="p-4 border-t border-pink-200/60">
          <div class="flex items-center justify-between text-sm text-pink-700">
            <span>Wonder Land</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- المحتوى الرئيسي -->
    <main class="flex-1 pt-16 md:pt-0 min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// المتغيرات التفاعلية
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

// Authentication
const { user, logout } = useAuth()

// معلومات المستخدم
const userEmail = computed(() => {
  return user.value?.email || 'مستخدم'
})

// إغلاق القوائم عند النقر خارجها
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

// دالة زيارة الموقع
const visitWebsite = () => {
  if (process.client) {
    window.open('/', '_blank')
  }
}

// دالة تسجيل الخروج
const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error)
  }
}

// إغلاق القائمة الجانبية عند تغيير المسار
watch(() => useRoute().path, () => {
  sidebarOpen.value = false
})

// التحقق من تسجيل الدخول - تم إزالته لتجنب إعادة التوجيه المستمرة
// يتم التعامل مع المصادقة في middleware بدلاً من ذلك

// Disable service worker to prevent workbox conflicts
onMounted(() => {
  if (process.client) {
    // Load the service worker cleanup script
    const script = document.createElement('script')
    script.src = '/disable-sw.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
/* أنماط القائمة الجانبية */
.nav-link {
  @apply flex items-center px-4 py-3 text-pink-700 rounded-xl hover:bg-gradient-to-l hover:from-pink-100 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 font-medium shadow-none;
}

.nav-link-active {
  @apply bg-gradient-to-l from-pink-200 via-purple-100 to-blue-100 text-purple-800 border-r-4 border-pink-500 shadow-lg;
}

.nav-icon {
  @apply h-5 w-5 ml-3 flex-shrink-0 text-pink-500;
}

/* تحسينات الانتقالات */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* تحسين التمرير */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #f472b6 #f3e8ff;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3e8ff;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #f472b6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #d946ef;
}
</style>
