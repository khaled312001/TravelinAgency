<template>
  <div>
    <div v-if="pending && !package_" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <span class="sr-only">{{ $t('common.loading') }}</span>
    </div>

    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('common.error') }}</h1>
      <p class="text-gray-600 mb-8">{{ error.message }}</p>
      <NuxtLink 
        to="/" 
        class="rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-dark transition-colors"
      >
        {{ $t('common.back_home') }}
      </NuxtLink>
    </div>

    <div 
      v-else-if="package_" 
      class="relative min-h-screen"
    >
      <!-- Hero Section -->
      <div 
        class="relative h-[40vh] md:h-[60vh]"
        :style="{
          viewTransitionName: `package-image-${package_.id}`
        }"
      >
        <NuxtImg
          :src="package_.image_url"
          class="h-full w-full object-cover"
          :alt="$i18n.locale === 'ar-SA' ? package_.title_ar : package_.title_en"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <!-- Content -->
      <div 
        class="relative z-10 -mt-32 rounded-t-[2.5rem] bg-surface px-4 pb-20 pt-12 md:px-8"
        :style="{
          viewTransitionName: `package-content-${package_.id}`
        }"
      >
        <PackageDetails 
          :package_="package_"
          @contact="showContactForm = true"
        />
      </div>
    </div>

    <!-- Package Not Found -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('packages.not_found') }}</h1>
      <p class="text-gray-600 mb-8">{{ $t('packages.not_found_description') }}</p>
      <NuxtLink 
        to="/packages" 
        class="rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-dark transition-colors"
      >
        {{ $t('packages.view_all') }}
      </NuxtLink>
    </div>

    <!-- Contact Form Modal -->
    <ContactForm v-model="showContactForm" :package_="package_" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Package } from '~/composables/usePackages'
import { usePackages } from '~/composables/usePackages'

import PackageDetails from '~/components/packages/PackageDetails.vue'
import ContactForm from '~/components/ContactForm.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const showContactForm = ref(false)

// Package data
const package_ = ref(null)
const pending = ref(true)
const error = ref(null)

// Fetch package data directly from API
const fetchPackage = async () => {
  try {
    pending.value = true
    error.value = null
    
    const packageId = route.params.id as string
    console.log('🔄 Loading package with ID:', packageId)
    
    const response = await $fetch(`/api/packages/${packageId}`)
    console.log('✅ Package data loaded:', response)
    
    if (response.package) {
      package_.value = response.package
    } else {
      throw new Error('Package not found')
    }
  } catch (err) {
    console.error('❌ Error loading package:', err)
    error.value = err
  } finally {
    pending.value = false
  }
}

// Define page meta for proper routing
definePageMeta({
  layout: 'default'
})

// Watch for route changes and fetch new package
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchPackage()
  }
}, { immediate: true })

// Load package on mount
onMounted(() => {
  fetchPackage()
})

// SEO
useHead({
  title: computed(() => package_.value ? `${package_.value[`title_${locale.value.slice(0, 2)}`]} | Wonder Land Agency` : 'Loading...'),
  meta: [
    {
      name: 'description',
      content: computed(() => package_.value?.[`description_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:title',
      content: computed(() => package_.value?.[`title_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:description',
      content: computed(() => package_.value?.[`description_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:image',
      content: computed(() => package_.value?.image_url || '')
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      property: 'og:type',
      content: 'product'
    },
    {
      property: 'og:price:amount',
      content: computed(() => package_.value?.price.toString() || '')
    },
    {
      property: 'og:price:currency',
      content: 'SAR'
    }
  ]
})
</script>