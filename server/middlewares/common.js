import bodyParser from 'koa-bodyparser'
import session from 'koa-session'

export const addBody = app => {
  app.use(bodyParser())
}

export const addSession = app => {
  app.keys = ['shibajiang']
  app.use(
    session({
      key: 'koa:sess',
      maxAge: 86400000,
      overwrite: true,
      signed: true,
      rolling: false
    }, app)
  )
}
