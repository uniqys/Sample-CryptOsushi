module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'airbnb-base',
    'plugin:vue/strongly-recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  // add your custom rules here
  rules: {
    semi: 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-param-reassign': [2, { 'props': false }],
    'import/prefer-default-export': 0,
    // for-ofのため
    'no-restricted-syntax': 'off',
  },
  settings: {
    "import/resolver": {
      "nuxt-import": {}
    }
  }
}
