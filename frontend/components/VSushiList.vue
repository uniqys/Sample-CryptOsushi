<template>
  <div class="sushi-list">
    <v-sushi-list-item
      class="sushi"
      v-for="(sushi) in sushiList"
      :key="sushi.key"
      :sushi="sushi"
    />
  </div>
</template>

<script>
import { orderBy, map } from 'lodash'
import VSushiListItem from '~/components/VSushiListItem'

export default {
  components: {
    VSushiListItem,
  },
  props: {
    sushiMapper: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: () => '',
    }
  },
  computed: {
    sushiList() {
      const sushiList = map(this.sushiMapper, (sushi, key) => Object.assign(sushi, { key }))
      return orderBy(sushiList, ['id'], [this.type === 'market' ? 'asc' : 'desc'])
    },
  },
}
</script>

<style lang="stylus" scoped>
.sushi-list {
  display: flex;
  align-items: center;
  flex-flow: row wrap;

  .sushi {
    margin-left: 24px;
    margin-bottom: 60px;
  }
}
</style>
