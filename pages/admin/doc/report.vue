<template lang="pug">
  div.report
    div.report-side
      el-form(:inline="true")
        el-form-item
          el-button(
            size="medium"
            @click="edit()"
          ) 新增 +
      div.report-side-table
        el-table(
          ref="listTable"
          :data="list"
          style="width: 200px"
          highlight-current-row
          v-loading="list.length===0"
          @row-click="itemClick"
        )
          el-table-column(prop="title" label="标题")
          el-table-column(prop="city.name" label="城市" width="65")
        el-pagination.admin-pagination(
          layout="prev, next"
          :total="totalCount"
          background
          :current-page.sync="currentPage"
        )
    div.report-content(v-if="editId || editing")
      el-form(
        ref="editingForm"
        :rules="editRule"
        :model="editing"
      )
        el-form-item
          el-col(:span="17")
            el-form-item(prop="title")
              el-input(v-if="editing" placeholder="请输入标题" v-model="editing.title")
              p.title(v-else) {{editHis.title}}
          el-col(:span="1") &nbsp
          el-col(:span="6" v-if="editing")
            el-form-item(prop="city")
              el-select(v-model="editing.city" placeholder="请选择城市" :style="{width: '100%'}")
                el-option(
                  v-for="item in citys"
                  v-if="item.leval === 1"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                )
        el-form-item(prop="context")
          editor(v-model="editing.context" v-if="editing")
          div.ql-snow(v-else)
            div.ql-editor(v-html="editHis.context")
        el-form-item
          template(v-if="editing")
            el-button(@click="editing=null") 取消
            el-button(type="primary" @click="editSubmit") 确定
          template(v-else)
            el-button(@click="edit(editHis)") 编辑
            el-button(type="danger" @click="del(editId)") 删除
</template>

<script>
  import { mapState } from 'vuex'
  import editor from '~/components/admin/editor.vue'
  import _find from 'lodash/find'
  import _findIndex from 'lodash/findIndex'
  import _clone from 'lodash/clone'

  const keys = `
    _id
    title
    context
    city {
      _id
      name
    }
  `

  const editRule = {
    title: [
      {required: true, message: '请输入标题', trigger: 'change'}
    ],
    context: [
      {required: true, message: '请输入内容', trigger: 'change'}
    ],
    city: [
      {required: true, message: '请选择城市', trigger: 'change'}
    ],
  }

  const editingInit = {
    title: '',
    context: '',
    city: undefined
  }

  export default {
    middleware: 'auth',
    name: 'report',
    layout: 'admin',
    components: {
      editor
    },
    async asyncData ({store}) {
      const data = await store.dispatch('getReports', {
        pageIndex: 1,
        keys
      })
      return {
        list: data.list,
        totalCount: data.totalCount
      }
    },
    data () {
      return {
        editId: null,
        editing: null,
        currentPage: 1,
        list: [],
        totalCount: 0,
        editRule
      }
    },
    computed: {
      editHis () {
        return _find(this.list, {
          _id: this.editId
        })
      },
      ...mapState([
        'citys'
      ])
    },
    methods: {
      edit (editing = editingInit) {
        this.editing = {
          ...editing,
          ...(editing.city ? {city: editing.city._id} : {})
        }
      },
      async del (id) {
        try {
          const comfirm =  await this.$confirm('将永久删除, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const { success } = await this.$store.dispatch('delReport', id)
          if (success) {
            const index = _findIndex(this.list, {_id: id})

            this.$message.success('删除成功!')
            this.list.splice(index, 1)
            this.editId = null
            this.editing = null
            if (this.list.length === 0){
              this.currentPage = this.currentPage - 1
            }
          } else {
            this.$message.error('删除失败，请稍后重试')
          }
        } catch (e) {
        }
      },
      async getList (pageIndex) {
        const data = await this.$store.dispatch('getReports', {
          pageIndex,
          keys
        })
        this.list = data.list
        this.totalCount = data.totalCount
      },
      itemClick (item) {
        this.$refs['listTable'].setCurrentRow(item)
        this.editId = item._id
        this.editing = null
      },
      editSubmit () {
        this.$refs['editingForm'].validate(async valid => {
          if (valid) {
            let edited = {
              ...this.editing
            }
            const { success } = await this.$store.dispatch('putReport', edited)
            if ( success ){
              this.$message.success('提交成功')
              if (!edited._id) {
                this.editId = null
              }
              this.editing = null
              this.getList(this.currentPage)
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
    watch: {
      currentPage (currentPage) {
        this.editing = null
        this.editId = null
        this.getList(currentPage)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .report
    display: flex
  .report-side
    margin-right: 20px
  .report-side-table
    border: 1px solid #ebeef5
    display: inline-block
  .report-content
    flex: 1
    .title
      font-size: 22px
      font-weight: 400
      margin: 6px 0
      color: #1f2f3d
</style>
