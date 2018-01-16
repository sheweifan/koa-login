<template lang="pug">
  div.container {{ project }}
</template>

<script>
  export default {
    name: 'home',
    computed: {
    },
    asyncData (context) {
      return { project: context.params.address }
    },
    data(){
      return {
      }
    },
    created(){
    },
    components: {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped
</style>
