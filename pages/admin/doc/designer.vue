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
      :data="designers"
      style="width: 100%"
      v-loading="designers===0"
      stripe
    )
      el-table-column(prop="name" label="名字" width="80")
      el-table-column(prop="city.name" label="城市" width="70")
      el-table-column(label="头像" width="80")
        template(scope="scope")
          el-popover(
            trigger="hover"
            placement="left"
          )
            img(:src="imgPrefix + scope.row.avatar + '?imageView2/0/w/200/h/200/q/75|imageslim'" width="200")
            div(slot="reference")
              el-tag(size="medium") 查看
      el-table-column(label="风格")
        template(scope="scope")
          span(
            size="medium"
            v-for="item in scope.row.styles"
            :key="item._id"
            :style="{'padding-right': '10px'}"
          ) {{item.label}}
      el-table-column(label="服务楼盘")
        template(scope="scope")
          span(
            size="medium"
            v-for="item in scope.row.services"
            :key="item._id"
            :style="{'padding-right': '10px'}"
          ) {{item.name}}
      //- el-table-column(prop="concept" label="个人说明")
      el-table-column(label="操作" width="200")
        template(scope="scope")
          el-button(
            size="mini"
            @click="edit(scope.row)"
          ) 编辑
          el-button(
            size="mini"
            type="danger"
          ) 删除
    el-pagination.admin-pagination(
      layout="prev, pager, next"
      :total="designerCount"
      background
      :current-page.sync="currentPage"
    )
    el-dialog(
      title="编辑"
      :visible.sync="editVisable"
      width="500px"
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
              :key="item.name"
              :label="item.name"
              :value="{_id: item._id, name: item.name}"
            )
        el-form-item(label="等级" prop="leval")
          el-select(v-model="editing.leval" placeholder="请选择")
            el-option(
              v-for="item in designerLeval"
              :key="item._id"
              :label="item.label"
              :value="{_id: item._id, label: item.label}"
            )
        el-form-item(label="个人说明" prop="concept")
          el-input(v-model="editing.concept" placeholder="请输入" type="textarea" :autosize="true" :maxlength="250")
        el-form-item(label="头像" prop="avatar")
          img(v-if="editing.avatar" :src="imgPrefix + editing.avatar + '?imageView2/0/w/200/h/200/q/75|imageslim'")
          el-upload.avatar-uploader(
            ref="avatarUploader"
            action="//up.qbox.me/"
            :show-file-list="false"
            :thumbnail-mode="true"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :data="postData"
          )
            el-button 上传/修改
            //- img(:src="imgPrefix + editing.avatar")
            //- .el-upload__text 将文件拖到此处，或<em>点击上传</em>
            //- el-button 点击上传
            .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过2M
        el-form-item(label="风格" prop="styles")
          el-checkbox-group(v-model="editing.styles")
            el-checkbox(
              v-for="item in styles"
              :key="item._id"
              :label="item._id"
              :style="{'margin-left':0, 'margin-right': '10px'}"
            ) {{item.label}}
        el-form-item(label="服务楼盘" v-if="editing.city" prop="services")
          el-tag(
            v-for="(item, index) in editing.services"
            :key="item._id"
            closable
            @close="editing.services.splice(index, 1)"
            :style="{'margin-right': '10px'}"
          ) {{item.name}}
          el-dropdown(
            trigger="click"
            @command="(item) => editing.services.push(item)"
          )
            el-button(type="small") 请添加 <i class="el-icon-arrow-down el-icon--right"></i>
            el-dropdown-menu.scroll(slot="dropdown")
              el-dropdown-item(
                v-for="item in difference(builds, editing.services)"
                v-if="item.city._id !== editing.city"
                key="item._id"
                :command="item"
              ) {{ item.name }}
      div.dialog-footer(slot="footer")
        el-button(@click="editVisable = false") 取消
        el-button(type="primary" @click="editSubmit") 确定

</template>

<script>
  import { mapState } from 'vuex'
  import uuid from 'node-uuid'
  import _difference from 'lodash/difference'
  import _map from 'lodash/map'

  const editingInit = {
    name: '',
    avatar: '',
    concept: '',
    leval: '',
    city: null,
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

  export default {
    middleware: 'auth',
    name: 'admin',
    layout: 'admin',
    data () {
      return {
        currentPage: 1,
        designers: [],
        designerCount: 0,
        editVisable: true,
        editing: editingInit,
        postData: {
          token: ''
        },
        editRule
      }
    },
    methods: {
      difference: _difference,
      edit (item = editingInit) {

        this.editVisable = true
        this.$nextTick(() => {
          this.$refs['editingDialog'].resetFields()
          this.editing = {
            ...item,
            styles: _map(item.styles, '_id')
          }
        })
      },
      paginationChange (pageIndex) {
        this.getDesigner(pageIndex)
      },
      async getDesigner(pageIndex, query="") {
        this.designers = []
        const {data: {data}} = await this.$store.dispatch('getDesigner', {
          pageIndex: pageIndex,
          keys: `
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
          `,
          query: query
        })
        this.designers = data.designers.list
        this.designerCount = data.designers.totalCount
      },
      handleSuccess(res, file) {
        this.editing.avatar = res.key
      },
      handleExceed(res) {
        this.$notify.error({
          title: '错误',
          message: '上传失败，超过个数限制。'
        })
      },

      async beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG&&!isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        const data = await this.$store.dispatch('getQiniuToken', 'designer/' + uuid.v1() + '.jpg')
        this.postData = data.data.data
        return isJPG && isPNG && isLt2m
      },

      editSubmit() {
        this.$refs['editingDialog'].validate(async valid => {
          if (valid) {
            let edited = {
              ...this.editing,
              leval: parseInt(this.editing.leval._id),
              city: parseInt(this.editing.city._id),
              services: _map(this.editing.services,item => parseInt(item._id)),
              styles: _map(this.editing.styles,item => parseInt(item))
            }
            const ret = await this.$store.dispatch('putDesigner', edited)
            console.log(ret)
            this.editVisable = false
          } else {
            this.$message.error('提交失败，请根据提示检查输入内容')
            return false;
          }
        });
      }
    },
    created () {
      this.getDesigner(1)
    },
    computed: {
      editingStyles () {
        return _map(editing.styles, '_id')
      },
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
        this.getDesigner(currentPage)
      },
      editing () {
        // this.$refs['editingDialog'].validate()
      }
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
  .admin-pagination
    padding: 30px 0
    text-align: center
  .scroll
    max-height: 300px
    overflow-x: hidden
    overflow-y: auto
</style>
