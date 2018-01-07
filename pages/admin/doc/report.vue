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
          :data="report"
          style="width: 200px"
          v-loading="report.length===0"
          @row-click="itemClick"
        )
          el-table-column(prop="title" label="标题")
        el-pagination.admin-pagination(
          layout="prev, next"
          :total="10"
          background
        )
    div.report-content
      el-form(
        ref="editingForm"
        :rules="editRule"
        :model="editing"
      )
        el-form-item
          //- p.title 对话大师现场|每一个设计都有故事
          el-col(:span="17")
            el-form-item(prop="title")
              el-input(placeholder="请输入标题" v-model="editing.title")
          el-col(:span="1") &nbsp
          el-col(:span="6")
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
          editor(v-model="editing.context")
        el-form-item
          el-button() 取消
          el-button(type="primary" @click="editSubmit") 确定
</template>

<script>
  import { mapState } from 'vuex'
  import editor from '~/components/admin/editor.vue'

  const keys = `
    _id
    title
    context
    city {
      _id
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

  export default {
    middleware: 'auth',
    name: 'report',
    layout: 'admin',
    components: {
      editor
    },
    data () {
      return {
        editing: {
          title: '',
          context: '',
          city: undefined
        },
        editRule,
        report: new Array(10).fill({title: '123'})
      }
    },
    computed: {
      ...mapState([
        'citys'
      ])
    },
    async mounted() {
      const data = await this.$store.dispatch('getReports', {
        pageIndex: 1,
        keys
      })
    },
    methods: {
      itemClick (item) {
        console.log(item)
      },
      editSubmit () {
        this.$refs['editingForm'].validate(async valid => {
          console.log(valid)
        })
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
