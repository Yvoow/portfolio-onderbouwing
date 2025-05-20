// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false, // disable ssr for now
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
  ],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  site: {
    url: 'https://fusionscripts.xyz',
    name: 'Fusion Scripts',
    sitemap: {
      exclude: ['/success'],
    }
  },
  app: {
    head: {
      titleTemplate: '%s | Fusion Scripts',
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/img/icon.png' },
        { rel: 'shortcut icon', href: '/img/icon.png' }
      ],
    },
  },
  ui: {
    theme: {
      colors: ['fsorange', 'fscyan', 'fsblue', 'red'],
    }
  },
  runtimeConfig: {
    public: {
      tebexApiKey: process.env.NUXT_PUBLIC_TEBEX_API_KEY
    }
  }
})