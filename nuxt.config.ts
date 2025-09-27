// https://nuxt.com/docs/api/configuration/nuxt-config
const productionURL = 'https://travelin-agency-coral.vercel.app'
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  
  devServer: {
    port: 3000,
    host: 'localhost'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon'
  ],

  icon: {
    collections: ['material-symbols']
  },

  
  // AOS configuration
  aos: {
    offset: 15,
    duration: 600,
    easing: 'ease-out-quad',
    once: true,
    delay: 100,
    mirror: true
  },

  runtimeConfig: {
    // MySQL Database configuration
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || 'travel',
    dbPassword: process.env.DB_PASSWORD || 'support@Passord123',
    dbName: process.env.DB_NAME || 'travel',
    
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    
    // Twilio configuration for WhatsApp notifications
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    salesManagerPhone: process.env.SALES_MANAGER_PHONE || '',
    
    public: {
      siteUrl: process.env.PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production'
        ? productionURL
        : 'http://localhost:3000'),
      
      // Public site URL for links in notifications
      publicSiteUrl: process.env.PUBLIC_SITE_URL || 'https://travelin-agency-coral.vercel.app'
    }
  },



  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'ar-SA',
    locales: [
      {
        code: 'en-US',
        language: 'en-US',
        name: 'English',
        dir: 'ltr'
      },
      {
        code: 'ar-SA',
        language: 'ar-SA',
        name: 'العربية',
        dir: 'rtl'
      }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    trailingSlash: true,
    differentDomains: false,
    lazy: true
  },
  // Configure sitemap for multiple languages
  sitemap: {
    urls: async () => {
      // Your sitemap URLs generation logic here
      return []
    }
  },

  css: [
    '~/assets/css/transitions.css',
    '~/assets/css/form.css',
    '~/assets/css/direction.css',
    '~/assets/css/tooltip.css'
  ],

  plugins: [
    // AOS plugin removed as it's now handled by the nuxt-aos module
    '~/plugins/i18n.client.ts',
    '~/plugins/language-direction.ts',
    '~/plugins/initial-direction.server.ts'
  ],

  nitro: {
    preset: 'vercel',
    minify: true
  },

  experimental: {
    viewTransition: true
  },

  app: {
    head: {
      title: 'World Trip Agency',
      htmlAttrs: {
        lang: 'ar-SA',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Your trusted travel partner for unforgettable experiences'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap'
        }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  build: {
    transpile: []
  },

  vite: {
    build: {
      cssMinify: true,
      minify: true
    },
    css: {
      devSourcemap: false
    }
  },
  compatibilityDate: '2025-02-07'
})