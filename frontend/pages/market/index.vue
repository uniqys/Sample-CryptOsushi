<template>
  <main>
    <div class="container">
      <h1 class="title">{{ $t('page.market') }}</h1>
      <v-sushi-list
        :sushi-mapper="getAllSushi()"/>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VSushiList from '~/components/VSushiList'

export default {
  created() {
    this.fetchGari()
  },
  computed: {
    ...mapGetters({
      getAllSushi: 'sushi/getMarketAll',
    }),
  },
  methods: {
    ...mapActions('gari', {
      fetchGari: 'fetch',
    }),
  },
  components: {
    VSushiList,
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/layouts/page.styl';
</style>
