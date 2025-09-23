<template>
  <section 
    class="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 w-full h-full">
      <NuxtImg 
        src="/images/about/hero-bg.jpeg" 
        alt="Business class airplane cabin with premium seating"
        class="w-full h-full object-cover"
        sizes="100vw sm:50vw md:400px"
        loading="eager"
        preload
        format="webp"
        quality="80"
      />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>
    
    <div class="relative container mx-auto px-4 md:px-8 lg:px-12 text-center z-10">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
        {{ $t('about.hero.title') }}
      </h1>
      <p class="text-base md:text-lg lg:text-xl text-white opacity-100 max-w-3xl mx-auto drop-shadow-md">
        {{ $t('about.hero.subtitle') }}
      </p>
      <NuxtLink 
        :to="localePath('packages')" 
        class="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-md transition duration-300 shadow-lg"
      >
        {{ $t('about.hero.cta') }}
      </NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
</script>