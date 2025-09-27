// Ultra-minimal Nuxt config for Vercel
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      siteUrl: 'https://travelin-agency-coral.vercel.app'
    }
  },

  nitro: {
    preset: 'vercel'
  },

  app: {
    head: {
      title: 'Travel Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
