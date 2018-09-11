<template>
  <div class="layout">
    <app-navbar/>
    <nuxt/>
    <app-footer/>
  </div>
</template>

<script>
import AppNavbar from '~/components/AppNavbar'
import AppFooter from '~/components/AppFooter'

export default {
  components: {
    AppNavbar,
    AppFooter,
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variables/font.styl';
@import '~assets/styles/variables/font-size.styl';

.layout {
  display: block;
  width: 1000px;
  margin: 0 auto;
  font-family: $font-family-webfont;
  font-size: $font-size-medium;
  line-height: 1.6rem;
}
</style>
