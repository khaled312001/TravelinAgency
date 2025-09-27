// Most basic Nuxt config possible
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  nitro: {
    preset: 'vercel'
  }
})
