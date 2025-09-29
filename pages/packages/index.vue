<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-cover bg-center py-20">
      <div class="absolute inset-0">
        <NuxtImg
          src="/images/packages/home/packages-hero-bg.jpeg"
          alt="Stunning beachfront villa with private pool and ocean views"
          width="1920"
          height="1080"
          loading="eager"
          format="webp"
          quality="80"
          class="w-full h-full object-cover"
          placeholder
        />
        <div class="absolute inset-0"></div>
      </div>
      <div class="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 class="mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
          {{ $t('packages.title') }}
        </h1>
        <p class="mb-8 text-xl md:text-2xl">
          {{ $t('packages.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Packages Grid -->
    <section class="py-16">
      <div class="container">
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-16">
          <div class="max-w-md mx-auto">
            <Icon name="material-symbols:error-outline" class="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 class="text-lg font-medium mb-2">{{ $t('common.error') }}</h3>
            <p class="text-gray-500">{{ error.message || 'An error occurred while loading packages' }}</p>
          </div>
        </div>
        <div v-else-if="packages.length === 0" class="text-center text-gray-500 py-16">
          <div class="max-w-md mx-auto">
            <Icon name="material-symbols:package-2-outline" class="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 class="text-lg font-medium mb-2">{{ $t('packages.no_packages') }}</h3>
            <p class="text-gray-500">{{ $t('packages.no_packages_description') }}</p>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PackageCard
            v-for="(package_, index) in packages"
            :key="index"
            :package_="package_"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Package } from '~/composables/usePackages'

import PackageCard from '~/components/packages/PackageCard.vue'
const { packages, pending, error } = usePackages()

// Check if packages page is published
definePageMeta({
  middleware: 'page-access'
})

</script>
