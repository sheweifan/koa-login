import qiniu from 'qiniu'
import config from '../config'

qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KEY = config.qiniu.SK
const bucket = config.qiniu.bucket
const client = new qiniu.rs.Client()

export const fetchImg = (url, key) => new Promise((resolve, reject) => {
  client.fetch(url, bucket, key, (err, ret) => {
    err ? reject(err) : resolve(ret)
  })
})
