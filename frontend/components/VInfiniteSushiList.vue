<template>
  <div>
    <v-sushi-list
      :sushi-mapper="getAllSushi()"
      :type="getType()"/>
    <infinite-loading
      @infinite="infiniteHandler">
      <span slot="no-results" />
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
      getType: 'sushi/getType',
      getAllSushi: 'sushi/getAll',
      getStartId: 'sushi/getStartId',
    }),
  },
  methods: {
    ...mapActions('sushi', {
      fetchSushi: 'fetch',
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
