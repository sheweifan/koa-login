import api from '../api'
import { controller, post, required } from '../decorators/router'

@controller('/admin')
export class Admin {
  @post('/login')
  @required({
    body: ['email', 'password']
  })
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    let { match, user } = await api.user.login(email, password)

    if (match) {
      const { _id, email, role, nickname } = user
      if (role !== 'admin') {
        return (ctx.body = {
          success: false,
          error: '没有权限'
        })
      }
      ctx.session.user = {
        _id, email, role, nickname
      }
      return (ctx.body = {
        success: true,
        data: {
          _id, email, role, nickname
        }
      })
    }

    return (ctx.body = {
      success: false,
      error: '密码错误'
    })
  }
  @post('/logout')
  async logout (ctx, next) {
    ctx.session = null
    return (ctx.body = {
      success: true
    })
  }
}
