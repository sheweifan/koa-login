import $ from './utils'
import {resolve} from 'path'
import uuid from 'node-uuid'
import { fetchImg } from '../api/qiniu'

const uploadDesigner = async () => {
  let data = await $.readFile(resolve(__dirname, './data/parsed/designers.json'))
  console.log(data.length)
  for (let i = 0; i < data.length; i++) {
  // for (let i = 0; i < 2; i++) {
    const url = 'http://shibajiang.com/' + data[i].avatar
    const key = 'designer/' + uuid.v1() + '.jpg'
    console.log(i, url, key)
    await fetchImg(url, key)
    data[i].avatar = key
  }
  await $.saveFile(resolve(__dirname, './data/parsed/designers.parsed.json'), data)
}

// uploadDesigner()
const uploadMap = async () => {
  let data = await $.readFile(resolve(__dirname, './data/parsed/maps.json'))
  console.log(data.length)
  // for (let i = 0; i < 2; i++) {
  for (let i = 0; i < data.length; i++) {
    const imgs = data[i].images
    if (!data[i].upload) {
      for (let j = 0; j < imgs.length; j++) {
        const url = 'http://shibajiang.com/' + imgs[j]
        const key = 'map/' + uuid.v1() + '.jpg'
        console.log(i, url, key)
        await fetchImg(url, key)
        data[i].images[j] = key
        data[i].upload = true

        await $.saveFile(resolve(__dirname, './data/parsed/maps.parsed.json'), data)
      }
    }
  }
}
uploadMap()
