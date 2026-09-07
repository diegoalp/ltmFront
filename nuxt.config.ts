// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxt/icon'],
  colorMode: {
    classSuffix: ''
  },
  css: ['~/assets/css/main.css','~/assets/scss/custom.scss'],
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://127.0.0.1:8000',
    apiKey: process.env.NUXT_API_KEY || '',
    public: {}
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  }
})
