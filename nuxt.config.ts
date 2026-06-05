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
    ['nuxt-security', {
      enabled: true,
      strict: false,
      headers: {
        contentSecurityPolicy: {
          'default-src': ["'self'"],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://*.tile.openstreetmap.org',
            'https://review.co.zw',
            'https://example.com',
          ],
          'script-src': [
            "'self'",
            'https://unpkg.com',
            'https://cdnjs.cloudflare.com',
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
          'connect-src': ["'self'"],
          'upgrade-insecure-requests': true,
        },
        strictTransportSecurity: {
          maxAge: 31536000,
          includeSubdomains: true,
          preload: true,
        },
        xFrameOptions: 'SAMEORIGIN',
        xContentTypeOptions: 'nosniff',
        referrerPolicy: 'strict-origin-when-cross-origin',
        permissionsPolicy: {
          camera: [],
          geolocation: [],
          microphone: [],
          payment: [],
        },
      },
      rateLimiter: {
        tokensPerInterval: 100,
        interval: 300000,
        throwError: true,
      },
      requestSizeLimiter: {
        maxRequestSizeInBytes: 2000000,
        maxUploadFileRequestInBytes: 8000000,
        throwError: true,
      },
      xssValidator: {
        throwError: true,
      },
      hidePoweredBy: true,
    }],
    '@nuxtjs/tailwindcss',
    'nuxt-qrcode',
    'nuxt-swiper'
  ],

  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'development-session-password-change-me',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  },

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

  routeRules: {
    '/api/admin/batches/upload': {
      security: {
        requestSizeLimiter: false,
        xssValidator: false,
      },
    },
    '/api/admin/ads/upload': {
      security: {
        requestSizeLimiter: false,
        xssValidator: false,
      },
    },
  },

  devtools: { enabled: true },
  components: true,
  css: [
    '@/assets/css/tailwind.css'
  ],
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  }
})
