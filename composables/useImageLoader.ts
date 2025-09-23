import { ref, onMounted } from 'vue'

export const useImageLoader = (src: string) => {
  const imageLoaded = ref(false)

  const onLoad = () => {
    imageLoaded.value = true
  }

  onMounted(() => {
    // Check if the image is already cached
    const img = new Image()
    img.onload = onLoad
    img.src = src
  })

  return {
    imageLoaded,
    onLoad
  }
}
