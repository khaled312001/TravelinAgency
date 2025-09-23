import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue, {
    themes: {
      tooltip: {
        arrow: true,
        contentClass: 'bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs text-center',
      }
    }
  })
})
