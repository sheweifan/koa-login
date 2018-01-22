<template lang="pug">
  div.container
    el-form.form
      el-input(v-model="email" placeholder="请输入账号" @keyup.enter.native="submit")
      div.form-brank
      el-input(v-model="password" type="password" placeholder="请输入密码" @keyup.enter.native="submit")
      div.form-brank
      el-button.button(type="primary" round :disabled="buttonDisabled" @click="submit") 提交
</template>

<script>
  import Vue from 'vue'

  import {
    Input,
    Button,
    Form,
    Notification
  } from 'element-ui'

  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Form)

  Vue.prototype.$notify = Notification

  function isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
  }

  export default {
    name: 'login',
    computed: {
      buttonDisabled(){
        return !isEmail(this.email) || this.password.length < 6
      }
    },
    data(){
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      async submit(){
        const { email, password } = this
        const data = await this.$store.dispatch('login', {
          email, password
        })
        if(data.success){
          this.$router.push('/admin')
        }else{
          this.$notify.error({
            title: '提示',
            message: data.error,
            duration: 2000
          });
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    height: 100vh
    display: flex
    justify-content: center
    align-items: center
    .form
      width: 300px
    .button
      width: 100%
  .form-brank
    height: 10px
</style>
