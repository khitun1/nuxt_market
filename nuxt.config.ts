// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "nuxt-site-config",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
  ],
  site: {
    url: `http://localhost:${process.env.PORT || 3000}`,
    name: "Nuxt store"
  },
  sitemap: {
    enabled: true,
  },
  robots: {
    enabled: true,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  primevue: {
    options: {
      ripple: true,
      unstyled: false,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "system",
        },
      },
    },
  },
  css: ["primeicons/primeicons.css"],
  build: {
    transpile: ["primeicons"],
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL,
    },
  },
  alias: {
    "@store": resolve(__dirname, "./store"),
  },
});
