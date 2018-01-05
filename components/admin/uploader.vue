<template lang="pug">
  el-upload.avatar-uploader(
    action="//up.qbox.me/"
    :show-file-list="showFileList"
    :multiple="multiple"
    list-type="picture"
    :limit="limit"
    :on-success="success"
    :on-remove="remove"
    :on-change="change"
    :on-exceed="exceed"
    :before-upload="beforeUpload"
    :data="postData"
    :file-list="list"
  )
    el-button(:style="{'margin-right': '10px'}") 上传/修改
    span 只能上传jpg/png文件，且不超过2M
</template>

<script>
  import uuid from 'node-uuid'
  import _map from 'lodash/map'
  import _isArray from 'lodash/isArray'
  import { mapState } from 'vuex'

  export default {
    name: 'uploader',
    props: {
      showFileList: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      value: Array,
      limit: Number
    },
    data () {
      return {
        postData: {
          token: ''
        },
        fileList: []
      }
    },
    computed: {
      list () {
        return _map(this.value, item => {
          if (item.name) return item
          else return {
            name: item.split('/')[1],
            response: {
              key: item
            },
            uid: 1,
            status: 'success',
            url: this.imgPrefix + item + '?imageView2/0/w/70/h/70/q/75|imageslim'
          }
        })
      },
      ...mapState([
        'imgPrefix'
      ])
    },
    methods: {
      async beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG&&!isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        const isOk = ( isJPG || isPNG ) && isLt2M
        if (isOk) {
          const data = await this.$store.dispatch('getQiniuToken', 'designer/' + uuid.v1() + '.jpg')
          this.postData = data.data.data
        }
        return isOk
      },
      success (res, file, fileList) {
        this.$emit('success', res, file, fileList)
      },
      change (file, fileList) {
        this.value = fileList
      },
      remove (file, fileList) {
        this.value = fileList
      },
      exceed () {
        this.$message.warning(`超过限制个数，请删除部分图片后重试`)
      },
      error () {
        this.$message.warning(`上传出错，请稍后重试`)
      }
    },
    watch: {
      value (list) {
        this.$emit('input', list)
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
