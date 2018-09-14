<template>
  <div
    v-if="sushi.state === 'Sale'"
    class="price">
    <span>
      {{ sushi.price }} gari
    </span>
  </div>
  <div
    v-else-if="sushi.state === 'SaleInput'"
    class="price-input">
    <input
      :class="{invalid: !isValid()}"
      v-model="editingPrice">
    <span>gari</span>
  </div>
  <div v-else />
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
    ...mapGetters({
      isValid: 'sushi/isValidEditingPrice',
    }),
    editingPrice: {
      get() {
        return this.$store.state.sushi.editingPrice
      },
      set(value) {
        this.editPrice({ price: value })
      },
    },
  },
  methods: {
    ...mapActions('sushi', [
      'editPrice',
    ]),
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.price {
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-input {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  input {
    width: 60%;
    margin-right: 5px;
    border: solid 1px;

    &:focus {
      outline: none;
    }

    &.invalid {
      color: $color-cancel;
      border-color: $color-cancel;
    }
  }
}
</style>
