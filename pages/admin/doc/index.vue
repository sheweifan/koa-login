<template lang="pug">
  div 首页
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
</style>
