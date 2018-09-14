// eslint-disable-next-line
const ja = require('./assets/locales/ja.json');
// eslint-disable-next-line
const en = require('./assets/locales/en.json');

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'cryptosushi',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, {
      hid: 'description',
      name: 'description',
      content: 'cryptosushi project',
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
    `http://${process.env.DAPP_HOST}:8080/sushi`,
    `http://${process.env.DAPP_HOST}:8080/gari`,
    `http://${process.env.DAPP_HOST}:8080/uniqys`,
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
    DAPP_ENDPOINT: (process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:3000'),
  },
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    use: [
    ],
  },
};
