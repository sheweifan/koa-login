<template lang="pug">
  el-tabs(v-model="tabActive" type="border-card")
    el-tab-pane(name="swiper" label="轮播图管理")
      el-table(:data="swiper")
        el-table-column(label="图片"  width="400")
          template(scope="scope")
            img(v-if="scope.row.image" :src="imgPrefix + scope.row.image + '?imageView2/0/w/200/q/75|imageslim'")
            uploader(:show-file-list="false" @success=" file => {swiper[scope.$index].image = file.key}" v-if="scope.row.edit")
        el-table-column(label="链接" width="350")
          template(scope="scope")
            el-input(v-if="scope.row.edit" type="url" placeholder="请输入链接" v-model="scope.row.link")
            div(v-else) {{scope.row.link}}
        el-table-column(label="操作")
          template(scope="scope")
            el-button(
              size="mini"
              type="warning"
              @click="allPut('putIndexSwiper', scope.row, scope.$index, 'swiper')"
            ) {{ scope.row.edit ? '提交' : '修改' }}
            el-button(
              size="mini"
              type="danger"
              @click="allDel('delIndexSwiper', scope.row._id, scope.$index, 'swiper')"
            ) 删除
      el-button(
        size="medium"
        :style="{margin: '10px 0'}"
        @click="addNewSwipe"
      ) 新增 +
    el-tab-pane(name="map" label="效果图")
      el-table(:data="map")
        el-table-column(label="图片" width="400")
          template(scope="scope")
            img(v-if="scope.row.image" :src="imgPrefix + scope.row.image + '?imageView2/0/w/200/q/75|imageslim'")
            uploader(:show-file-list="false" @success="file => {scope.row.image = file.key}" v-if="scope.row.edit")
        el-table-column(label="效果图id" width="120")
          template(scope="scope")
            el-input(v-if="scope.row.edit" type="number" placeholder="请输入id" v-model.number="scope.row.map")
            div(v-else) {{scope.row.map}}
        el-table-column(label="描述" width="350")
          template(scope="scope")
            el-input(v-if="scope.row.edit" type="url" placeholder="请输入描述" v-model="scope.row.desc")
            div(v-else) {{scope.row.desc}}
        el-table-column(label="操作")
          template(scope="scope")
            el-button(
              size="mini"
              type="warning"
              @click="allPut('putIndexMap',scope.row, scope.$index, 'map')"
            ) {{ scope.row.edit ? '提交' : '修改' }}
            el-button(
              size="mini"
              type="danger"
              @click="allDel('delIndexMap', scope.row._id, scope.$index, 'map')"
            ) 删除
      el-button(
        size="medium"
        :style="{margin: '10px 0'}"
        @click="addNewMap"
      ) 新增 +
    el-tab-pane(name="designer" label="设计师")
      el-table(:data="designer")
        el-table-column(label="设计师id")
          template(scope="scope")
            el-input(v-if="scope.row.edit" type="number" placeholder="请输入id" v-model.number="scope.row.designer")
            div(v-else) {{ scope.row.designer }}
        el-table-column(label="操作")
          template(scope="scope")
            el-button(
              size="mini"
              type="warning"
              @click="allPut('putIndexDesigner',scope.row, scope.$index, 'designer')"
            ) {{ scope.row.edit ? '提交' : '修改' }}
            el-button(
              size="mini"
              type="danger"
              @click="allDel('delIndexDesigner', scope.row._id, scope.$index, 'designer')"
            ) 删除
      el-button(
        size="medium"
        :style="{margin: '10px 0'}"
        @click="addNewDesigner"
      ) 新增 +
</template>

<script>
  import { mapState } from 'vuex'
  import _map from 'lodash/map'
  import _clone from 'lodash/clone'
  import uploader from '~/components/admin/uploader.vue'
  const SWIPER_MAX_LENGTH = 5
  const MAP_MAX_LENGTH = 6
  const newSwipe = {
    _id: null,
    image: '',
    link: '',
    edit: true
  }
  const newMap = {
    _id: null,
    image: '',
    map: null,
    desc: '',
    edit: true
  }
  const newDesigner = {
    designer: null,
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
        tabActive: 'swiper',
        designer: [],
        swiper: [],
        map: []
      }
    },
    async created () {
      await this.getData()
    },
    methods: {
      async getData () {
        const data = await this.$store.dispatch('getIndexData')
        this.swiper = _map(data.swiper, item => ({
          ...item,
          edit: false
        }))
        this.map = _map(data.map, item => ({
          ...item,
          map: item.map._id,
          edit: false
        }))
        this.designer = _map(data.designer, item => ({
          ...item,
          designer: item.designer._id,
          edit: false
        }))
      },
      addNewSwipe () {
        if (this.swiper.length >= SWIPER_MAX_LENGTH) {
          this.$message.error('最多只能五条数据')
          return
        }
        this.swiper.push(_clone(newSwipe))
      },
      addNewMap () {
        if (this.map.length >= MAP_MAX_LENGTH) {
          this.$message.error('最多只能五条数据')
          return
        }
        this.map.push(_clone(newMap))
      },
      addNewDesigner () {
        this.designer.push(_clone(newDesigner))
      },
      async allPut (dispatch, row, index) {
        if (!row.edit) {
          row.edit = true
        } else {
          const success = await this.$store.dispatch(dispatch, row)
          if (success) {
            this.$message.success('提交成功')
            row.edit = false
          } else {
            this.$message.error('提交失败，请确认内容正确')
          }
        }
      },
      async allDel (dispatch, _id, index, key) {
        if (_id == null) {
          this[key].splice(index, 1)
          return
        }
        try {
          const comfirm =  await this.$confirm('将永久删除, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const success = await this.$store.dispatch(dispatch, _id)
          if (success) {
            this.$message.success('删除成功!')
            this[key].splice(index, 1)
          } else {
            this.$message.error('删除失败，请稍后重试')
          }

        } catch (e) {
          console.log(e)
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
