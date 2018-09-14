<template>
  <div ref="poyo">
    <v-sushi-list
      :sushi-mapper="getAllSushi()"/>
    <infinite-loading
      @infinite="infiniteHandler">
      <span slot="no-results">{{ $t('sushi.status.noResults') }}</span>
      <span slot="no-more">{{ $t('sushi.status.noMore') }}</span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading';
import VSushiList from '~/components/VSushiList'

export default {
  components: {
    InfiniteLoading,
    VSushiList,
  },
  data: () => ({
    first: true,
  }),
  computed: {
    ...mapGetters({
      getAllSushi: 'sushi/getAll',
      getStartId: 'sushi/getStartId',
    }),
  },
  methods: {
    ...mapActions('gari', {
      fetchGari: 'fetch',
    }),
    ...mapActions('sushi', {
      fetchSushi: 'fetch',
      reset: 'reset',
    }),
    async infiniteHandler($state) {
      await this.fetchSushi();


      if (this.getStartId()) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
}
</script>
