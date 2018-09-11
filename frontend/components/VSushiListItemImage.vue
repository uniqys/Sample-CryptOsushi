<template>
  <figure>
    <div class="img-wrapper">
      <img :src="dishSrc" >
      <img src="/img/sushi/syari/syari.png" >
      <img :src="netaSrc" >
      <img :src="spiceSrc" >
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
  }
}
</style>

<script>

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
  }),
  created() {
    this.dnaCache = Buffer.from(this.sushi.dna, 'hex')
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
