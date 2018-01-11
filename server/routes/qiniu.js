import uuid from 'node-uuid'
import api from '../api'
import { controller, get, required } from '../decorators/router'

@controller('/qiniu')
export class Admin {
  @get('/getToken')
  @required({
    query: ['key']
  })
  async getToken (ctx, next) {
    let {key} = ctx.query
    key = key + '/' + uuid.v1() + '.jpg'
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
