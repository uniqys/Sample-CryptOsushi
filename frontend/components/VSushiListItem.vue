<template>
  <transition name="fade">
    <div v-click-outside="() => cancelSaleInput({ key: this.sushi.key })">
      <div
        v-if="sushi.state === 'SaleTx'"
        class="sushi is-tx">
        {{ $t('sushi.status.sellTx') }}
      </div>
      <div
        v-else-if="sushi.state === 'SaleCancelTx'"
        class="sushi is-tx">
        {{ $t('sushi.status.cancelTx') }}
      </div>
      <div
        v-else-if="sushi.state === 'GenerateTx'"
        class="sushi is-tx">
        {{ $t('sushi.status.generateTx') }}
      </div>
      <div
        v-else
        class="sushi"
        :class="{'is-sale-input': sushi.state === 'SaleInput'}">
        <v-sushi-list-item-header
          class="sushi-header"
          :sushi="sushi"/>

        <v-sushi-list-item-image
          class="sushi-image"
          :sushi="sushi"/>

        <v-sushi-list-item-price
          class="sushi-price"
          :sushi="sushi"/>

        <v-sushi-list-item-button
          class="sushi-button"
          :sushi="sushi"/>
      </div>
    </div>
  </transition>

</template>

<script>
import VSushiListItemHeader from '~/components/VSushiListItemHeader';
import VSushiListItemImage from '~/components/VSushiListItemImage';
import VSushiListItemButton from '~/components/VSushiListItemButton';
import VSushiListItemPrice from '~/components/VSushiListItemPrice';
import ClickOutside from 'vue-click-outside';
import { mapActions } from 'vuex';

export default {
  components: {
    VSushiListItemHeader,
    VSushiListItemImage,
    VSushiListItemButton,
    VSushiListItemPrice,
  },
  props: {
    sushi: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions({
      cancelSaleInput: 'sushi/cancelSaleInput',
    }),
  },
  data: () => ({
    inputPrice: 0,
  }),
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.sushi {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: $color-background-lightgray;
  width: 176px;

  &:hover {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  }

  .sushi-header {
    height: 30px;
  }

  .sushi-image {
    height: 156px;
    width: 100%;
    margin: 0;
  }

  .sushi-price {
    height: 20px;
    width: 100px;
  }

  .sushi-button {
    height: 30px;
    width: 100px;
    margin: 10px 0;
  }
}

.is-tx {
  height: 255px;
  width: 176px;
  line-height: 255px;
  background-color: $color-transaction;
  color: $color-sub;
}

.is-sale-input {
  transform: scale(1.2);
  transform-origin: center;
  transition: all 0.1s ease-in;
}
</style>
