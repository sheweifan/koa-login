<template lang="pug">
  el-tabs
    el-tab-pane(label="轮播图管理")
      el-table(:data="swiper")
        el-table-column(label="图片")
          template(scope="scope")
            img(v-if="scope.row.image" :src="imgPrefix + scope.row.image + '?imageView2/0/w/200/q/75|imageslim'")
            uploader(:show-file-list="false" @success=" file => {swiper[scope.$index].image = file.key}" v-if="scope.row.edit")
        el-table-column(label="链接" width="350")
          template(scope="scope")
            el-input(v-if="scope.row.edit" type="url" placeholder="请输入链接" v-model="scope.row.link")
            div(v-else) {{scope.row.link}}
        el-table-column(label="操作" width="200")
          template(scope="scope")
            el-button(
              size="mini"
              type="warning"
              @click="swiperEdit(scope.row, scope.$index)"
            ) {{ scope.row.edit ? '提交' : '修改' }}
            el-button(
              size="mini"
              type="danger"
              @click="swiperDel(scope.row, scope.$index)"
            ) 删除
      el-button(
        size="medium"
        :style="{margin: '10px 0'}"
        @click="addNewSwipe"
      ) 新增 +
    el-tab-pane(label="效果图")
      div 效果图
    el-tab-pane(label="设计师")
      div 设计师
</template>

<script>
  import { mapState } from 'vuex'
  import _map from 'lodash/map'
  import uploader from '~/components/admin/uploader.vue'
  const SWIPER_MAX_LENGTH = 5
  const newSwipe = {
    _id: null,
    image: '',
    link: '',
    edit: true
  }
  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    components: {
      uploader
    },
    data () {
      return {
        swiper: []
      }
    },
    async created () {
      await this.getData()
    },
    methods: {
      async getData () {
        const data = await this.$store.dispatch('getIndexData')
        console.log(data)
        this.swiper = _map(data.swiper, item => ({
          ...item,
          edit: false
        }))
      },
      addNewSwipe () {
        if (this.swiper.length >= SWIPER_MAX_LENGTH) {
          this.$message.error('最多只能五条数据')
          return
        }
        this.swiper.push(newSwipe)
      },
      async swiperEdit (row, index) {
        if (!row.edit) {
          console.log(this.swiper[index], index)
          this.swiper[index].edit = true
        } else {
          const success = await this.$store.dispatch('putIndexSwiper', row)
          if (success) {
            this.$message.success('提交成功')
            this.swiper[index].edit = false
          }
        }
      }
    },
    computed: {
      ...mapState([
        'imgPrefix'
      ])
    }
  }
</script>

<style scoped lang="stylus">
</style>
