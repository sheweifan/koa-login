<template lang="pug">
  div
    editor(v-model="context")
</template>

<script>
  import editor from '~/components/admin/editor.vue'
  export default {
    middleware: 'auth',
    name: 'news',
    layout: 'admin',
    components: {
      editor
    },
    data () {
      return {
        context: ''
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .quill-editor{
    height: 400px
  }
</style>
