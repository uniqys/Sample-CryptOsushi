<template>
  <footer>
    <div class="body">
      <ul class="link-list">
        <li>
          <router-link
            :to="localePath('terms-of-service')">{{ $t('page.termsOfService') }}</router-link>
        </li>
        <li><a
          href="https://github.com/uniqys/UniqysKit-preview"
          target="_blank">GitHub (Uniqys Kit)</a></li>
        <li><a
          href="https://github.com/uniqys/Sample-CryptOsushi"
          target="_blank">GitHub (CryptOsushi)</a></li>
        <li><a
          href="https://medium.com/uniqys/uniqys-kit-dapps-development-part1-b45f380cfe82"
          target="_blank">Medium</a></li>
      </ul>
      <section class="copyright">
        <small>&copy; Uniqys Project</small>
      </section>
    </div>
  </footer>
</template>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';
@import '~assets/styles/variables/font-size.styl';

footer {
  height: 130px;

  .body {
    width: 1000px;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px;
    background-color: $color-background-lightgray;

    .link-list {
      $_height = 20px;
      padding: 0;

      li {
        margin-right: 1em;
        padding-right: 1em;
        border-right: 1px $color-main solid;
        height: $_height;
        line-height: $_height;
        display: inline-block;

        &:last-child {
          border-right-width: 0;
        }

        a {
          height: $_height;
          color: $color-main;
          text-decoration: none;
        }
      }
    }

    .copyright {
      display: block;
    }
  }
}
</style>
