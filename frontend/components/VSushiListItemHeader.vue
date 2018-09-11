<template>
  <header class="header">
    <span class="id">
      {{ sushi.id }}
    </span>
    <span
      v-if="sushi.state === 'Sale'"
      class="sale-pop">
      {{ $t('sushi.status.sell') }}
    </span>
  </header>
</template>

<script>
export default {
  props: {
    sushi: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.header {
  display: block;
  position: relative;
  text-align: center;
  background-color: $color-background-darkgray;
  width: 100%;

  .id {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .sale-pop {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 0 8px;
    color: $color-sub;
    background-color: $color-transaction;
  }
}
</style>
