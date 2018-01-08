<template lang="pug">
  div
    div.quill-editor(
      v-model="value"
      :multiple="false"
      placeholder="请输入内容"
      @change="onEditorChange($event)"
      v-quill:myQuillEditor="editorOption"
    )
    uploader(
      ref="uploader"
      v-show="false"
      :show-file-list="false"
      @success="uploaderSuccess"
    )
</template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import uploader from '~/components/admin/uploader.vue'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import 'quill/dist/quill.core.css'

  if (process.browser) {
    const VueQuillEditor = require('vue-quill-editor/dist/ssr')
    Vue.use(VueQuillEditor)
  }

  const container = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['image']
  ]

  export default {
    name: 'editor',
    components: {
      uploader
    },
    props: {
      value: {
        type: String
      }
    },
    data () {
      const self = this
      return {
        content: '',
        editorOption: {
          modules: {
            toolbar: {
              container,
              handlers: {
                image: function() {self.imgHandler(this)}
              }
            }
          }
        }
      }
    },
    methods: {
      onEditorChange ({ editor, html, text }) {
        // this.content = html
        this.$emit('input', html)
      },
      imgHandler (handle) {
        this.quill = handle.quill
        this.quillIndex = this.quill.getSelection().index
        const input = this.$refs.uploader.$el.querySelector('.el-upload')
        input.click()
      },
      uploaderSuccess (file) {
        const index = this.quillIndex
        const imgUrl = `${this.imgPrefix}${file.key}?imageView2/0/q/60|imageslim`
        this.quill.insertEmbed(index, 'image', imgUrl)
      }
    },
    computed: {
      ...mapState([
        'imgPrefix',
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  .quill-editor{
    height: 500px
  }
</style>
