// eslint-disable-next-line
const ja = require('./assets/locales/ja.json');
// eslint-disable-next-line
const en = require('./assets/locales/en.json');

const env = {
  UNIQYS_NODE_HOST: process.env.UNIQYS_NODE_HOST || 'localhost',
  UNIQYS_NODE_PORT: process.env.UNIQYS_NODE_PORT || '8080',
  DAPP_ENDPOINT: process.env.DAPP_ENDPOINT || 'http://localhost:3000',
}

const TITLE = 'CryptOsushi'
const DESCRIPTION = 'CryptOsushi is a sample decentralized application made with Uniqys Kit. Source code: https://github.com/uniqys/Sample-CryptOsushi'

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: DESCRIPTION,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: TITLE,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: DESCRIPTION,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: env.DAPP_ENDPOINT },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${env.DAPP_ENDPOINT}/img/ogp.png`,
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [
    'normalize.css/normalize.css',
    // For FontAwesome5.
    // @nuxtjs/font-awesomeが4.7なので
    // SEE ALSO: https://qiita.com/_rema_lp/items/137f0de9e039a464e7db
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
  ],
  /*
  ** Modules
  */
  modules: [
    'nuxt-client-init-module',
    'nuxt-vuex-router-sync',
    '@nuxtjs/proxy',
    '@nuxtjs/markdownit',
    ['nuxt-i18n', {
      seo: false,
      vuex: false,
      locales: [
        {
          code: 'ja',
          iso: 'ja',
          name: '日本語',
        },
        {
          code: 'en',
          iso: 'en-US',
          name: 'English',
        },
      ],
      defaultLocale: 'ja',
      vueI18n: {
        fallbackLocale: 'ja',
        messages: {
          ja, en,
        },
      },
    }],
  ],
  /*
  ** Plugins
  */
  proxy: [
    `http://${env.UNIQYS_NODE_HOST}:${env.UNIQYS_NODE_PORT}/sushi`,
    `http://${env.UNIQYS_NODE_HOST}:${env.UNIQYS_NODE_PORT}/gari`,
    `http://${env.UNIQYS_NODE_HOST}:${env.UNIQYS_NODE_PORT}/uniqys`,
  ],
  plugins: [
    { src: '~plugins/webfontloader', ssr: false },
    { src: '~plugins/easyclient', ssr: false },
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js | vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
  env: {
    DAPP_ENDPOINT: env.DAPP_ENDPOINT,
  },
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    use: [
    ],
  },
};
