import Vue from 'vue'

// 全部引用，此时需要在nuxt.config.js中设置css
// if (process.BROWSER_BUILD) {
//   Vue.use(require('element-ui'))
// }

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
// 按需引用
// import {
//   Input,
//   Button,
//   Form,
//   Notification
// } from 'element-ui'

// Vue.component(Input.name, Input)
// Vue.component(Form.name, Form)
// Vue.component(Button.name, Button)

// Vue.prototype.$notify = Notification
