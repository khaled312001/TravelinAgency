<template>
  <section 
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    :style="{
      backgroundColor: section.background_color || '#1e40af'
    }"
  >
    <!-- Video Background -->
    <div v-if="section.settings?.video_background" class="absolute inset-0 z-0">
      <!-- Desktop Video -->
      <video 
        v-if="section.settings.desktop_video"
        ref="videoRef" 
        preload="auto" 
        autoplay 
        loop 
        muted 
        playsinline 
        class="hidden md:block w-full h-full object-cover"
        :poster="section.settings.poster_image"
      >
        <source :src="section.settings.desktop_video" type="video/mp4">
      </video>

      <!-- Mobile Video -->
      <video 
        v-if="section.settings.mobile_video"
        autoplay 
        loop 
        muted 
        playsinline 
        preload="auto" 
        class="md:hidden w-full h-full object-cover"
        :poster="section.settings.poster_image"
      >
        <source :src="section.settings.mobile_video" type="video/mp4">
      </video>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20"></div>
    </div>

    <!-- Image Background -->
    <div 
      v-else-if="section.background_image && !section.settings?.video_background"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${section.background_image})` }"
    ></div>

    <!-- Background Overlay -->
    <div 
      v-if="section.background_image || section.settings?.video_background"
      class="absolute inset-0 bg-black bg-opacity-50"
    ></div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <!-- Title -->
        <h1 
          v-if="section.title"
          class="text-4xl md:text-6xl font-bold mb-6"
          :style="{ color: section.text_color || '#ffffff' }"
        >
          {{ section.title }}
        </h1>

        <!-- Subtitle -->
        <p 
          v-if="section.subtitle"
          class="text-xl md:text-2xl mb-8 opacity-90"
          :style="{ color: section.text_color || '#ffffff' }"
        >
          {{ section.subtitle }}
        </p>

        <!-- Content -->
        <div 
          v-if="section.content"
          class="text-lg mb-8 opacity-80"
          :style="{ color: section.text_color || '#ffffff' }"
          v-html="section.content"
        ></div>

        <!-- Content Blocks -->
        <div v-if="section.content_blocks && section.content_blocks.length > 0" class="space-y-6">
          <div
            v-for="block in section.content_blocks"
            :key="block.id"
            class="flex justify-center"
          >
            <!-- Button Block -->
            <div v-if="block.block_type === 'button'" class="space-x-4 space-x-reverse">
              <NuxtLink
                v-if="block.link_url"
                :to="block.link_url"
                class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {{ block.link_text || 'اكتشف المزيد' }}
                <Icon name="material-symbols:arrow-forward" class="h-5 w-5 mr-2" />
              </NuxtLink>
            </div>

            <!-- Image Block -->
            <div v-else-if="block.block_type === 'image'" class="max-w-md">
              <img
                :src="block.image_url"
                :alt="block.title || 'Hero Image'"
                class="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            <!-- Video Block -->
            <div v-else-if="block.block_type === 'video'" class="max-w-2xl">
              <div class="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  :src="block.video_url"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <!-- Text Block -->
            <div v-else-if="block.block_type === 'text'" class="max-w-2xl">
              <h3 
                v-if="block.title"
                class="text-2xl font-semibold mb-4"
                :style="{ color: section.text_color || '#ffffff' }"
              >
                {{ block.title }}
              </h3>
              <div 
                v-if="block.content"
                class="text-lg opacity-90"
                :style="{ color: section.text_color || '#ffffff' }"
                v-html="block.content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <Icon 
        name="material-symbols:keyboard-arrow-down" 
        class="h-8 w-8"
        :style="{ color: section.text_color || '#ffffff' }"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      section_type: 'hero',
      title: '',
      subtitle: '',
      content: '',
      background_color: '#1e40af',
      background_image: '',
      text_color: '#ffffff',
      content_blocks: [],
      settings: {}
    })
  }
})

const videoRef = ref(null)

// Intersection Observer for video optimization
onMounted(() => {
  if (videoRef.value && props.section.settings?.video_background) {
    const { stop } = useIntersectionObserver(
      videoRef,
      ([{ isIntersecting }]) => {
        if (videoRef.value) {
          if (isIntersecting) {
            videoRef.value.play()
          } else {
            videoRef.value.pause()
          }
        }
      }
    )
  }
})
</script>
