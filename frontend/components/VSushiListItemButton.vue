<template>
  <button
    v-if="sushi.state === 'Normal' && sushi.owner === getMyAddress()"
    class="button"
    @click="startSaleInput({ key: sushi.key })">
    {{ $t('sushi.action.sell') }}
  </button>
  <button
    v-else-if="sushi.state === 'SaleInput'"
    class="button is-sell-confirm"
    @click="sell({ id: sushi.id, key: sushi.key })">
    {{ $t('sushi.action.sellConfirm') }}
  </button>
  <button
    v-else-if="sushi.state === 'Sale' && sushi.owner === getMyAddress()"
    class="button is-cancel"
    @click="cancelSale({ id: sushi.id, key: sushi.key })">
    {{ $t('sushi.action.cancel') }}
  </button>
  <button
    v-else-if="sushi.state === 'Sale' && sushi.owner !== getMyAddress()"
    class="button is-buy"
    @click="buy({ id: sushi.id, key: sushi.key })">
    {{ $t('sushi.action.buy') }}
  </button>
  <div v-else/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    sushi: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('sushi', [
      'getMyAddress',
    ]),
  },
  methods: {
    ...mapActions({
      startSaleInput: 'sushi/startSaleInput',
      sell: 'sushi/sell',
      cancelSale: 'sushi/cancelSale',
    }),
    ...mapActions('sushi', [
      'buy',
    ]),
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.button {
  border: none;
  background-color: $color-main;
  color: $color-sub;
  cursor: pointer;

  &.is-buy, &.is-sell {
    background-color: $color-main;
  }

  &.is-sell-confirm {
    background-color: $color-transaction;
  }

  &.is-cancel {
    background-color: $color-cancel;
  }
}
</style>
