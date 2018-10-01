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
import { mapActions } from 'vuex'

export default {
  components: {
    VInfiniteSushiList,
  },
  methods: {
    ...mapActions('sushi', [
      'reset'
    ]),
  },
  created() {
    this.reset()
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/layouts/page.styl';
</style>
