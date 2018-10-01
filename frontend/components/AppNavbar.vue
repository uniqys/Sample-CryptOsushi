<template>
  <nav class="header">
    <div class="contents">
      <img
        src="/img/logo.png"
        class="title-logo">
      <div class="currency">
        {{ getBalance() }} gari
      </div>
      <ul class="menu">
        <li><nuxt-link
          :to="localePath('index')"
          class="nav-button"
          :class="{ selected: $route.path === localePath('index') }">
          <span>
            {{ $t('page.mySushi') }}
          </span>
        </nuxt-link></li>
        <li><nuxt-link
          :to="localePath('market')"
          class="nav-button"
          :class="{ selected: $route.path === localePath('market') }">
          <span>
            {{ $t('page.market') }}
          </span>
        </nuxt-link></li>
        <li><nuxt-link
          :to="localePath('all-sushi')"
          class="nav-button"
          :class="{ selected: $route.path === localePath('all-sushi') }">
          <span>
            {{ $t('page.allSushi') }}
          </span>
        </nuxt-link></li>
      </ul>
      <nuxt-link
        class="language"
        :to="switchLocalePath(localeTo)">
        <i class="fas fa-exchange-alt"/>
        <span
          class="language-select"
          id="language"
          name="language">
          {{ localeToName }}
        </span>
      </nuxt-link>
      <button
        @click="onGenerate()"
        class="nigiru-button">{{ $t('sushi.action.generate') }}</button>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    localeTo() {
      return this.$i18n.locale === 'ja' ? 'en' : 'ja'
    },
    localeToName() {
      return this.localeTo === 'ja' ? 'JA' : 'EN'
    },
    ...mapGetters('gari', [
      'getBalance',
    ]),
  },
  methods: {
    async onGenerate() {
      window.scrollTo(0, 0)
      if (this.$route.path !== this.localePath('index')) {
        this.$router.push({ path: this.localePath('index') })
        await this.fetch();
      }
      this.generate()
    },
    ...mapActions('sushi', [
      'generate',
      'fetch',
      'reset',
    ]),
  },
}
</script>


<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.header {
  height: 100px;

  .contents {
    position: fixed;
    top: 0;
    width: 1000px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    background-color: $color-background;

    .title-logo {
      height: 42px;
    }

    .currency {
      display: block;
      width: 160px;
      margin-left: 20px;
      padding: 8px 0;
      background: $color-background-lightgray;
      text-align: center;
    }

    .menu {
      display: flex;
      flex: 1;
      justify-content: flex-end;

      li {
        display: inline-block;
        width: 110px;

        .nav-button {
          color: $color-main;
          display: block;
          width: 100%;
          text-align: center;
          text-decoration: none;

          &:hover {
            color: $color-text-hover;
          }

          &.selected {
            font-weight: bold;

            span {
              display: inline-block;
              border-bottom: solid 2px $color-main;
            }
          }
        }
      }
    }

    .language {
      position: fixed;
      top: -1px;
      right: 20px;
      display: block;
      padding: 4px 10px;
      border: 1px solid $color-main;
      text-decoration: none;
      color: $color-main;

      &:hover {
        background-color: $color-main;
        color: $color-sub;
      }

      .language-select {
        padding: 8px;
        font-weight: bold;
      }
    }

    .nigiru-button {
      height: 40px;
      width: 120px;
      margin-left: 20px;
      padding: 6px 0;
      border: none;
      background-color: $color-main;
      color: $color-sub;
      cursor: pointer;
    }
  }
}
</style>
