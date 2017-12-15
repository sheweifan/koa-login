<template lang="pug">
  div
    el-table(
      :data="bannerData"
      style="width: 100%"
      stripe
    )
      el-table-column(type="index" width="50")
      el-table-column(prop="date" label="日期" width="180")
      el-table-column(prop="name" label="图片" width="180")
      el-table-column(prop="link" label="链接")
      el-table-column(label="操作")
        template(scope="scope")
          el-button(
            size="mini"
            @click="bannerEdit(scope.$index, scope.row)"
          ) 编辑
          el-button(
            size="mini"
            type="danger"
          ) 删除
    el-dialog(
      title="编辑"
      :visible.sync="bannerEditVisable"
      width="30%"
    )
      el-form(
        :model="ruleForm2"
        status-icon :rules="rules2"
        ref="ruleForm2"
        label-width="70px"
      )
        el-form-item(label="链接地址" prop="pass")
          el-input(v-model="input" placeholder="请输入")
        el-form-item(label="图片" prop="pass")
          el-upload(
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          )
            i.el-icon-upload
            div.el-upload__text 将文件拖到此处，或<em>点击上传</em>
      div.dialog-footer(slot="footer")
        el-button(@click="bannerEditVisable = false") 取消
        el-button(type="primary" @click="bannerEditVisable = false") 确定
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    asyncData () {
      return {
        bannerEditVisable: false,
        bannerData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            link: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            link: '上海市普陀区金沙江路 1518 弄'
          }
        ]
      }
    },
    methods: {
      bannerEdit(index, item){
        console.log(index, item)
        this.bannerEditVisable = true
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    }
  }
</script>

<style scoped lang="stylus">
</style>
