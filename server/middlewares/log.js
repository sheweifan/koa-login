import { resolve } from 'path'
import log4js from 'log4js'

const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']

const access = (ctx, message, commonInfo) => {
  const {
    method,
    url,
    host,
    headers
  } = ctx.request
  const client = {
    method,
    url,
    host,
    message,
    referer: headers['referer'],
    userAgent: headers['user-agent']
  }
  return JSON.stringify(Object.assign(commonInfo, client))
}

export const log = app => {
  const contextLogger = {}
  const appenders = {}

  appenders.cheese = {
    type: 'dateFile',
    filename: `log/task`,
    pattern: '-yyyy-MM-dd.log',
    alwaysIncludePattern: true
  }

  if (!(app.env === 'production')) {
    appenders.out = {
      type: 'console'
    }
  }

  let config = {
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: 'warn'
      }
    }
  }

  const logger = log4js.getLogger('cheese')

  app.use(async (ctx, next) => {
    const start = Date.now()
    log4js.configure(config)
    methods.forEach((method, i) => {
      contextLogger[method] = (message) => {
        logger[method](access(ctx, message, {}))
      }
    })
    ctx.log = contextLogger
    await next()
    const responseTime = Date.now() - start
    logger.info(access(ctx, {
      responseTime: `response time${responseTime / 1000}s`
    }, {}))
  })
}
