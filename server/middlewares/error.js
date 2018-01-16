export const error = app => {
  app.use(async (ctx, next) => {
    try {
      await next()
      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
    } catch (e) {
      ctx.log.error(e.message)
    }
  })
}
