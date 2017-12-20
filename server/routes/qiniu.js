import api from '../api'
import { controller, get, required } from '../decorators/router'

@controller('/qiniu')
export class Admin {
  @get('/getToken')
  @required({
    query: ['key']
  })
  async getToken (ctx, next) {
    const {key} = ctx.query
    const token = await api.qiniu.getQiniuToken(key)

    ctx.body = {
      success: true,
      data: {
        token,
        key
      }
    }
  }
}
