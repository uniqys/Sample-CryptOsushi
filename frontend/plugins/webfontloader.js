// @see
// https://github.com/typekit/webfontloader
// https://github.com/nuxt/nuxt.js/issues/1150
import WebFontLoader from 'webfontloader'

WebFontLoader.load({
  custom: {
    urls: [
      'https://fonts.googleapis.com/earlyaccess/notosansjapanese.css',
    ],
  },
})
