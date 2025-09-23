<template>
  <div class="relative overflow-hidden" :class="wrapperClass">
    <!-- Blur placeholder -->
    <NuxtImg
      :src="src"
      :alt="alt"
      width="50"
      height="50"
      class="absolute inset-0 w-full h-full object-cover blur-xl scale-110 transform"
      :class="{ 'opacity-0': imageLoaded }"
      quality="10"
      format="webp"
      placeholder
    />
    
    <!-- Main image with responsive sizes -->
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :class="[
        imageClass,
        'transition-opacity duration-1000',
        { 'opacity-0': !imageLoaded }
      ]"
      :sizes="sizes"
      :loading="loading"
      format="webp"
      :quality="quality"
      @load="onImageLoad"
      placeholder
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  wrapperClass?: string
  imageClass?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  quality?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  wrapperClass: '',
  imageClass: 'w-full h-full object-cover',
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'lazy',
  quality: 80
})

const { imageLoaded, onLoad } = useImageLoader(props.src)

const onImageLoad = () => {
  onLoad()
}
</script>
