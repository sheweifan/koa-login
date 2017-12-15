<template lang="pug">
  div.container
    el-form.form
      el-input(v-model="email" placeholder="请输入账号")
      div.form-brank
      el-input(v-model="password" placeholder="请输入密码")
      div.form-brank
      el-button.button(type="primary" round :disabled="buttonDisabled" @click="submit") 提交
</template>

<script>
  import '../plugins/element-ui'
  export default {
    name: 'login',
    computed: {
      buttonDisabled(){
        return this.email === '' || this.password === ''
      }
    },
    data(){
      return {
        email: '',
        password: ''
      }
    },
    components: {
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
