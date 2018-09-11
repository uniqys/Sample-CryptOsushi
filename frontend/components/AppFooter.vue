<template>
  <footer class="footer">
    <section class="copyright">
      <small>&copy; Uniqys Project</small>
    </section>
  </footer>
</template>

<style lang="stylus" scoped>
@import '~assets/styles/variables/color.styl';

.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  background-color: $color-background-lightgray;

  .policy {
    display: block;
    color: $color-main;
    text-decoration: none;
  }

  .copyright {
    display: block;
  }
}
</style>
