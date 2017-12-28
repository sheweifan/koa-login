<template lang="pug">
  el-container.admin-container
    //- el-header
      //- navbar
    el-container
      el-aside(width="200px")
        side
      el-main
        nuxt
</template>

<script>
  import '../plugins/element-ui'
  import side from '../components/admin/side'
  import navbar from '../components/admin/navbar'
  export default {
    components: {
      side,
      navbar
    },
    created () {
      this.$store.dispatch('getTypes')
    }
  }
</script>

<style lang="stylus">
  *
    line-height: 1.25
  .admin-container
    height: 100vh
    .el-header, .el-footer
      background-color: #e6e6e6
      line-height: 60px

    .el-aside
      background-color: #E9EEF3
      line-height: 200px

    .el-main
      // overflow: auto
      // background-color: #
      line-height: 160px

  .admin-pagination
    padding: 30px 0
    text-align: center
</style>
