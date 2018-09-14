<template>
  <main>
    <div class="container">
      <h1 class="title">利用規約</h1>
      <div v-html="content"/>
    </div>
  </main>
</template>

<script>
import content from '~/assets/markdown/terms-of-service/ja.md'

export default {
  data() {
    return {
      content,
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/layouts/page.styl';
</style>
