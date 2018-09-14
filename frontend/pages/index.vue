<template>
  <main>
    <div class="container">
      <h1 class="title">
        {{ $t('page.mySushi') }}
      </h1>
      <v-infinite-sushi-list/>
    </div>
  </main>
</template>

<script>
import VInfiniteSushiList from '~/components/VInfiniteSushiList'

export default {
  components: {
    VInfiniteSushiList,
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/layouts/page.styl';
</style>
