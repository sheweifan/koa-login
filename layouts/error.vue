<template lang="pug">
  div.page-404
    div
      p.title {{ error.statusCode }}
      p.info {{ error.message }}
      nuxt-link(to="/") back home page
</template>

<script>
  export default {
    props: ['error']
  }
</script>

<style lang="stylus" scoped>
  .page-404
    height: 100vh
    box-sizing: border-box
    padding-bottom: 200px
    display: flex
    justify-content: center
    align-items: center
    text-align: center
    .title
      font-size: 40px
      line-height: 2
</style>
