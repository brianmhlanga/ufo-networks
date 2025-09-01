// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  nitro: {
    compatibilityDate: '2025-07-29'
  },
  modules: [
    '@primevue/nuxt-module',
    'nuxt-auth-utils',
    'nuxt-scheduler',
    '@nuxtjs/tailwindcss'
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: false,
        },
      }
    }
  },
  devtools: { enabled: true },
  // Auto-import components
  components: true,
  css: [
    '@/assets/css/tailwind.css'
  ],
  // Add Material Icons to head for better loading
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  }
}) 