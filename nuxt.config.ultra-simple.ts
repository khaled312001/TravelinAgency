export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  nitro: {
    preset: 'vercel'
  }
})
