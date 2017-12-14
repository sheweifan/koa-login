import { fetchImg } from './api/qiniu'

(async () => {
  try {
    const url = 'http://shibajiang.com/attach/image/20170720/1500520835456.jpg'
    const data = await fetchImg(url, 'test123123123.png')
    console.log(data)
  } catch (e) {
    console.log('eeee', e)
  }
})()
