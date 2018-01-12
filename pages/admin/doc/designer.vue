<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
        el-button(
          size="medium"
          @click="edit()"
        ) 新增 +
    //-   el-form-item
    //-     el-input(type="search" placeholder="请输入搜索内容")
    //-   el-form-item
    //-     el-button(type="primary" size="medium") 搜索
    el-table(
      :data="list"
      style="width: 100%"
      v-loading="list.length===0"
      stripe
    )
      el-table-column(prop="name" label="名字" width="80")
      el-table-column(prop="city.name" label="城市" width="70")
      el-table-column(label="头像" width="80")
        template(slot-scope="scope")
          el-popover(
            trigger="hover"
            placement="left"
          )
            img(:src="imgPrefix + scope.row.avatar + '?imageView2/0/w/200/h/200/q/75|imageslim'" width="200")
            div(slot="reference")
              el-tag(size="medium") 查看
      el-table-column(label="风格")
        template(slot-scope="scope")
          span(
            size="medium"
            v-for="item in scope.row.styles"
            :key="item._id"
            :style="{'padding-right': '10px'}"
          ) {{item.label}}
      el-table-column(label="服务楼盘")
        template(slot-scope="scope")
          span(
            size="medium"
            v-for="item in scope.row.services"
            :key="item._id"
            :style="{'padding-right': '10px'}"
          ) {{item.name}}
      //- el-table-column(prop="concept" label="个人说明")
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
      :total="totalCount"
      background
      :current-page.sync="currentPage"
    )

    el-dialog(
      title="编辑"
      :visible.sync="editVisable"
      width="800px"
    )
      el-form(
        v-if="editing"
        :model="editing"
        :rules="editRule"
        label-width="80px"
        ref="editingDialog"
      )
        el-form-item(label="名称" prop="name")
          el-input(v-model="editing.name" placeholder="请输入" :maxlength="5")
        el-form-item(label="城市" prop="city")
          el-select(v-model="editing.city" placeholder="请选择" @change="editing.services = []")
            el-option(
              v-for="item in citys"
              v-if="item.leval === 1"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            )
        el-form-item(label="等级" prop="leval")
          el-select(v-model="editing.leval" placeholder="请选择")
            el-option(
              v-for="item in designerLeval"
              :key="item._id"
              :label="item.label"
              :value="item._id"
            )
        el-form-item(label="个人说明" prop="concept")
          el-input(v-model="editing.concept" placeholder="请输入" type="textarea" :autosize="true" :maxlength="250")
        el-form-item(label="头像" prop="avatar")
          img(v-if="editing.avatar" :src="imgPrefix + editing.avatar + '?imageView2/0/w/200/h/200/q/75|imageslim'")
          uploader(:show-file-list="false" @success="file => this.editing.avatar = file.key")
        el-form-item(label="风格" prop="styles")
          el-checkbox-group(v-model="editing.styles")
            el-checkbox(
              v-for="item in styles"
              :key="item._id"
              :label="item._id"
              :style="{'margin': '10px 10px 0 0', 'width': '100px'}"
            ) {{item.label}}
        el-form-item(label="服务楼盘" prop="services" v-if="editing.city")
          el-checkbox-group(v-model="editing.services")
            el-checkbox(
              v-for="item in builds"
              v-if="item.city._id === editing.city"
              :key="item._id"
              :label="item._id"
              :style="{'margin': '10px 10px 0 0', 'width': '150px'}"
            ) {{item.name}}
      div.dialog-footer(slot="footer")
        el-button(@click="editVisable = false") 取消
        el-button(type="primary" @click="editSubmit") 确定

</template>

<script>
  import { mapState } from 'vuex'
  import _map from 'lodash/map'
  // import _find from 'lodash/find'
  // import _forEach from 'lodash/forEach'
  // import _keys from 'lodash/keys'
  import _isEqual from 'lodash/isEqual'
  import uploader from '~/components/admin/uploader.vue'

  const editingInit = {
    name: '',
    avatar: '',
    concept: '',
    leval: undefined,
    city: undefined,
    styles: [],
    services: []
  }

  const editRule = {
    name: [
      {required: true, message: '请输入姓名', trigger: 'change'}
    ],
    avatar: [
      {required: true, message: '请上传头像', trigger: 'change'}
    ],
    concept: [
      {required: false}
    ],
    services: [
      {required: false}
    ],
    city: [
      {required: true, message: '请选择城市', trigger: 'change'}
    ],
    leval: [
      {required: true, message: '请选择等级', trigger: 'change'}
    ],
    styles: [
      {required: true, message: '请添加风格', trigger: 'change'}
    ]
  }

  const keys = `
    _id
    avatar
    name
    concept
    leval {
      _id
      label
    }
    styles {
      _id
      label
    }
    services {
      _id
      name
      city {
        _id
        name
      }
    }
    city {
      _id
      name
    }
  `

  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    data () {
      return {
        currentPage: 1,
        list: [],
        totalCount: 0,
        editVisable: false,
        editing: editingInit,
        editRule,
        test: []
      }
    },
    components: {
      uploader
    },
    methods: {
      edit (item = editingInit) {
        this.editVisable = true
        this.$nextTick(() => {CryptoKey
          this.$refs['editingDialog'].resetFields()
          this.editing = {
            ...item,
            concept: item.concept.replace(/\<br \/\>/g, '\n'),
            styles: _map(item.styles, '_id'),
            services: _map(item.services, '_id'),
            city: item.city ? item.city._id : null,
            leval: item.leval ? item.leval._id : null
          }
        })
      },
      async del (item, index) {
        try {
          const comfirm =  await this.$confirm('将永久删除该设计师, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const success = await this.$store.dispatch('delDesigner', item._id)
          if (success) {
            this.$message.success('删除成功!')
            // this.designers.splice(index, 1)
            // if (this.designers.length === 0){
            //   this.currentPage = this.currentPage - 1
            // }
            this.getList(this.currentPage)
          } else {
            this.$message.error('删除失败，请稍后重试')
          }
        } catch (e) {
        }
      },
      paginationChange (pageIndex) {
        this.getList(pageIndex)
      },
      async getList (pageIndex, query="") {
        this.designers = []
        const data = await this.$store.dispatch('getDesigner', {
          pageIndex: pageIndex,
          keys,
          query: query
        })
        this.list = data.list
        this.totalCount = data.totalCount
      },
      editSubmit () {
        this.$refs['editingDialog'].validate(async valid => {

          if (valid) {
            // const isNew  = !this.editing._id
            let edited = {
              ...this.editing
            }
            // if (!isNew) {
            //   // is update
            //   const nowEditing = _find(this.designers, item => item._id = this.editing._id)

            //   if (nowEditing) {
            //     let edited2 = {}
            //     _forEach(nowEditing, (value, key) => {
            //       if (!_isEqual(value, edited[key])) {
            //         edited2[key] = value
            //       }
            //     })
            //     if (_keys(edited2).length === 0) {
            //       this.$message.error('数据没有变化，请修改内容后提交')
            //       return false
            //     }
            //     edited = edited2
            //   }
            // }
            const success = await this.$store.dispatch('putDesigner', edited)
            if ( success ){
              this.$message.success('提交成功')
              this.editVisable = false
              this.getDesigner(this.currentPage)
            } else {
              this.$message.error('提交失败，请稍后重试')
            }
          } else {
            this.$message.error('提交失败，请根据提示检查输入内容')
            return false;
          }
        });
      }
    },
    created () {
      this.getList(1)
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
        this.getList(currentPage)
      },
      'editing.avatar' () {
        this.$nextTick(() => {
          !_isEqual(this.editing, editingInit) && this.$refs['editingDialog'].validateField('avatar')
        })
      }
      // ,
      // editing () {
        // this.$refs['editingDialog'].validate()
      // }
      // ['editing.city'](newCity, oldCity) {
      //   if (oldCity !== newCity) {
      //     this.$nextTick(() => {
      //       this.editing.services = []
      //     })
      //   }
      // }
    }
  }
</script>

<style scoped lang="stylus">
  .scroll
    max-height: 300px
    overflow-x: hidden
    overflow-y: auto
</style>
