<template>
  <NuxtErrorBoundary>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 text-center px-4">
      <img
        src="/images/404/travel-lost.svg"
        alt="404 Illustration"
        class="w-64 h-64 mx-auto mb-6 animate-float"
        loading="lazy"
      />
      <h1 class="text-5xl font-extrabold text-white mb-3 md:text-7xl">
        {{ $t('error.404.title') }}
      </h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mt-4 mb-8 max-w-md mx-auto">
        {{ $t('error.404.description') }}
      </p>
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center px-6 py-3 rounded-lg bg-primary-500 text-white font-semibold shadow-lg hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        <Icon name="material-symbols:home-rounded" class="mr-2 text-2xl" />
        {{ $t('error.404.back_home') }}
      </NuxtLink>
    </div>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
useHead(() => ({
 status: 404,
 title: t('error.404.title'),
}));
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
