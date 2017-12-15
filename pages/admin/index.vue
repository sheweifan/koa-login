<template lang="pug">
ul
  li 账号： {{ user.email }}
  li 角色： {{ user.role }}
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    middleware: 'auth',
    layout: 'admin',
    name: 'admin',
    computed: {
      ...mapState([
        'user'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  // .title
    // margin: 50px 0;
</style>
