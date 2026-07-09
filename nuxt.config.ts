// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  extends: [
    './layers/ui',
  ],

  modules: [
    '@nuxt/fonts',
    '@nuxt/a11y',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://toolbox.trenlok.com',
    name: 'VSCode Toolbox',
    indexable: true,
  },

  sitemap: {
    xsl: false,
    credits: false,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'page',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#242424' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        {
          rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png',
        },
        {
          rel: 'shortcut icon', href: '/favicon.ico',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  nitro: {
    storage: {
      cache: {
        driver: 'fs',
        base: './.data/cache',
      },
    },
    devStorage: {
      cache: {
        driver: 'fs',
        base: './.data/cache',
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://toolbox.trenlok.com',
    },
  },

  fonts: {
    families: [
      {
        name: 'Geist',
        provider: 'google',
        global: true,
        weights: ['100 900'],
        styles: ['normal'],
      },
    ],
  },

  components: {
    dirs: [
      { path: '@/components/global', prefix: 'B', extensions: ['.vue'] },
      { path: '@/components/widgets', prefix: 'W', extensions: ['.vue'] },
      { path: '@/components/pages', prefix: 'P', extensions: ['.vue'] },
    ],
  },

  css: [
    '@/assets/scss/optimize.scss',
    '@/assets/scss/typography.scss',
    '@/assets/scss/theme.scss',
    '@/assets/scss/global.scss',
    '@/assets/scss/animations.scss',
  ],

  typescript: {
    typeCheck: false,
    tsConfig: {
      include: [
        '../eslint.config.ts',
      ],
      compilerOptions: {
        verbatimModuleSyntax: false,
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@rhapsodic/bem-classnames-vue',
      ],
    },
  },
});
