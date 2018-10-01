<template>
  <figure>
    <div class="img-wrapper" :class="{animation: isAnimation}">
      <img class="dish" :src="dishSrc" >
      <img class="syari" src="/img/sushi/syari/syari.png" >
      <img class="neta" :src="netaSrc" >
      <img class="spice" :src="spiceSrc" >
    </div>
  </figure>
</template>

<style lang="stylus" scoped>
figure {
  display: flex;
  justify-content: center;

  .img-wrapper {
    margin-top: 17.5px;
    width: 140px;
    position: relative;

    img {
      width: 140px;
      position: absolute;
    }

    &.animation {
      img {
        $_animation-delay = .25s;
        $_animation-duration = .5s;

        width: 140px;
        opacity: 0;
        position: absolute;
        animation-name: slidein;
        animation-fill-mode: forwards;

        &.dish {
          animation-delay: 0;
          animation-duration: $_animation-duration;
        }
        &.syari {
          animation-delay: $_animation-delay * 1;
          animation-duration: $_animation-duration;
        }
        &.neta {
          animation-delay: $_animation-delay * 1;
          animation-duration: $_animation-duration;
        }
        &.spice {
          animation-delay: $_animation-delay * 2;
          animation-duration: $_animation-duration;
        }
      }
    }
  }
}

@keyframes slidein {
  from {
    margin-top: -24px;
    opacity: 0;
  }

  to {
    margin-top: 0;
    opacity: 1;
  }
}
</style>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    sushi: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dnaCache: null,
    pattern: 10,
    isAnimation: false,
  }),
  created() {
    this.dnaCache = Buffer.from(this.sushi.dna, 'hex')
    if (this.sushi.animation) {
      this.isAnimation = true
      this.stopAnimation({type: 'my', key: this.sushi.key})
    }
  },
  methods: {
    ...mapActions('sushi', [
      'stopAnimation',
    ]),
  },
  computed: {
    code() {
      if (!this.dnaCache) {
        return {}
      }
      return {
        dish: this.dnaCache.readUInt16BE(0) % this.pattern,
        neta: this.dnaCache.readUInt16BE(4) % this.pattern,
        spice: this.dnaCache.readUInt16BE(8) % this.pattern,
      }
    },
    dishSrc() {
      return `/img/sushi/dish/dish-0${this.code.dish}.png`
    },
    netaSrc() {
      return `/img/sushi/neta/neta-0${this.code.neta}.png`
    },
    spiceSrc() {
      return `/img/sushi/spice/spice-0${this.code.spice}.png`
    },
  },
}
</script>
