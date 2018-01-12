<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
        el-button(
          size="medium"
          @click="edit()"
        ) 新增 +
    el-table(
      :data="maps"
      style="width: 100%"
      v-loading="maps.length===0"
      stripe
    )
      el-table-column(type="expand")
        template(slot-scope="scope")
          span(v-for="(item, index) in scope.row.images" :key="index")
            img(:src="imgPrefix + item + '?imageView2/0/w/400/q/75|imageslim'")
      el-table-column(prop="title" label="标题" width="150")
      el-table-column(prop="city.name" label="城市" width="50")
      el-table-column(prop="area.name" label="区域" width="70")
      el-table-column(prop="designer.name" label="设计师" width="70")
      el-table-column(prop="measure" label="面积" width="70")
      el-table-column(prop="style.label" label="风格" width="80")
      el-table-column(label="描述")
        template(slot-scope="scope")
          div(v-html="parseBr(scope.row.desc)")
      el-table-column(label="操作" width="200")
        template(slot-scope="scope")
          el-button(
            size="mini"
            type="warning"
            @click="edit(scope.row)"
          ) 编辑
          el-button(
            size="mini"
            type="danger"
            @click="del(scope.row, scope.$index)"
          ) 删除
    el-pagination.admin-pagination(
      layout="prev, pager, next"
      :total="mapCount"
      background
      :current-page.sync="currentPage"
    )
    el-dialog(
      title="编辑"
      :visible.sync="editVisable"
      width="800px"
    )
      el-form(
        :rules="editRule"
        v-if="editing"
        :model="editing"
        label-width="80px"
        ref="editingDialog"
      )
        el-form-item(label="标题" prop="title")
          el-input(v-model="editing.title" placeholder="请输入" :maxlength="5")
        el-form-item(label="描述" prop="desc")
          el-input(v-model="editing.desc" placeholder="请输入" type="textarea" :autosize="true" :maxlength="250")
        el-form-item(label="面积" prop="measure")
          el-input(type="number" v-model.number="editing.measure" placeholder="请输入" :maxlength="5")
        el-form-item(label="城市" required)
          el-col(:span="9")
            el-form-item(prop="city")
              el-select(v-model="editing.city" placeholder="请选择" @change="cityChange")
                el-option(
                  v-for="item in citys"
                  v-if="item.leval === 1"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                )
          el-col(:span="9" v-if="editing.city")
            el-form-item(prop="area")
              el-select(v-model="editing.area" placeholder="请选择")
                el-option(
                  v-for="item in citys"
                  v-if="item.parentId === editing.city"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                )
        el-form-item(label="楼盘" prop="build" v-if="editing.city")
          el-select(v-model="editing.build" placeholder="请选择" filterable)
            el-option(
              v-for="item in builds"
              v-if="item.city._id === editing.city"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            )
        el-form-item(label="风格" prop="style")
          el-select(v-model="editing.style" placeholder="请选择")
            el-option(
              v-for="item in styles"
              :key="item._id"
              :label="item.label"
              :value="item._id"
            )
        el-form-item(label="设计师" prop="designer" v-if="editing.city")
          designer-selecter(v-model="editing.designer" :query="{city: editing.city}")
        el-form-item(label="图片" prop="images")
          uploader(v-model="editing.images")
      div.dialog-footer(slot="footer")
        el-button(@click="editVisable = false") 取消
        el-button(type="primary" @click="editSubmit") 确定
</template>

<script>
  import { mapState } from 'vuex'
  import _map from 'lodash/map'
  import _get from 'lodash/get'
  import _isString from 'lodash/isString'
  import _clone from 'lodash/clone'
  import _isEqual from 'lodash/isEqual'
  import designerSelecter from '~/components/admin/designer-selecter.vue'
  import uploader from '~/components/admin/uploader.vue'

  // const editing = {"title":"呵呵","desc":"哦哦","city":1001,"area":1,"build":120,"designer":73,"style":2,"images":["designer/d9c14c90-eba3-11e7-acb2-fd1392acee47.jpg"],"measure":123}
  const editingInit = {
    title: '',
    desc: '',
    city: undefined,
    area: undefined,
    build: undefined,
    designer: undefined,
    style: undefined,
    images: []
  }
  const keys = `
    _id
    title
    desc
    images
    measure
    style {
      _id
      label
    }
    designer {
      _id
      name
    }
    city {
      _id
      name
    }
    build {
      _id
      name
    }
    area {
      _id
      name
    }
  `
  const editRule = {
    title: [
      {required: true, message: '请输入标题', trigger: 'change'}
    ],
    desc: [
      {required: false}
    ],
    measure: [
      {required: true, message: '请输入面积', trigger: 'change'}
    ],
    city: [
      {required: true, message: '请选择城市', trigger: 'change'}
    ],
    area: [
      {required: true, message: '请选择区域', trigger: 'change'}
    ],
    build: [
      {required: true, message: '请选择楼盘', trigger: 'change'}
    ],
    designer: [
      {required: true, message: '请选择设计师', trigger: 'change'}
    ],
    style: [
      {required: true, message: '请选择风格', trigger: 'change'}
    ],
    images: [
      {required: true, message: '请上传图片', trigger: 'change'}
    ],
  }
  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    components: {
      designerSelecter,
      uploader
    },
    data () {
      return {
        currentPage: 1,
        maps: [],
        editVisable: false,
        mapCount: 0,
        editing: _clone(editingInit),
        editRule
      }
    },
    methods: {
      parseBr (str) {
        return str ? str.replace(new RegExp('\n', 'ig'), '<br/>') : null
      },
      edit (item = editingInit) {
        this.editVisable = true
        this.$nextTick(() => {CryptoKey
          this.$refs['editingDialog'].resetFields()
          this.editing = {
            ...item,
            area: _get(item.area, '_id'),
            city: _get(item.city, '_id'),
            build: _get(item.build, '_id'),
            designer: _get(item.designer, '_id'),
            style: _get(item.style, '_id'),
            // desc: item.desc ? item.desc : item.desc.replace(/\<br \/\>/g, '\n')
          }
        })
      },
      async del (item, index) {
        try {
          const comfirm =  await this.$confirm('将永久删除效果图, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const success = await this.$store.dispatch('delMap', item._id)
          if (success) {
            this.$message.success('删除成功!')
            this.maps.splice(index, 1)
            if (this.maps.length === 0){
              this.currentPage = this.currentPage - 1
            }
          } else {
            this.$message.error('删除失败，请稍后重试')
          }
        } catch (e) {
        }
      },
      async getMap (pageIndex, query="") {
        this.maps = []
        const data = await this.$store.dispatch('getMap', {
          pageIndex: pageIndex,
          keys,
          query: query
        })
        this.maps = data.list
        this.mapCount = data.totalCount
      },
      cityChange () {
        this.editing.area = editingInit.area
        this.editing.build = editingInit.build
        this.editing.designer = editingInit.designer
      },
      editSubmit () {
        this.$refs['editingDialog'].validate(async valid => {
          console.log(this.editing.desc)
          if (valid) {
            let edited = {
              ...this.editing,
              images:  _map(this.editing.images, item => _isString(item) ? item : item.response.key)
            }
            const success = await this.$store.dispatch('putMap', edited)
            if ( success ){
              this.$message.success('提交成功')
              this.editVisable = false
              this.getMap(this.currentPage)
            } else {
              this.$message.error('提交失败，请稍后重试')
            }
          } else {
            this.$message.error('提交失败，请根据提示检查输入内容')
            return false;
          }
        })
      }
    },
    created () {
      this.getMap(1)
    },
    computed: {
      ...mapState([
        'user',
        'imgPrefix',
        'citys',
        'builds',
        'designerLeval',
        'styles'
      ])
    },
    watch: {
      currentPage (currentPage) {
        this.getMap(currentPage)
      },
      'editing.images' (editing) {
        this.$nextTick(() => {
          !_isEqual(this.editing, editingInit) && this.$refs['editingDialog'].validateField('images')
        })
      }
    }
  }
</script>
