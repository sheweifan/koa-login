<template lang="pug">
  div.container {{ project }}
</template>

<script>
  export default {
    name: 'home',
    computed: {
    },
    asyncData (context) {
      // console.log(context)
      return { project: context.params.address }
    },
    data(){
      return {
      }
    },
    created(){
      console.log(1)
    },
    components: {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped
</style>
