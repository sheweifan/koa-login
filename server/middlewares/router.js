import { resolve } from 'path'
import { Route } from '../decorators/router'
// http://ntest.free.ngrok.cc/wechat-redirect?a=1&b=2

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const route = new Route(app, apiPath)
  route.init()
}
