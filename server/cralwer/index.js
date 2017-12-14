const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')
const devices = require('puppeteer/DeviceDescriptors')

const $ = require('./utils')
const iPhone = devices['iPhone 6']

const prefix = ['nj', 'wh', 'wx']

async function index() {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.emulate(iPhone)

  await page.goto('http://shibajiang.com/h5')

  let banners = await page.evaluate(() => {
    let banner = [...document.querySelectorAll('.slider2 li')]
    return banner.map(item => {
      const a = item.querySelector('a')
      const img = item.querySelector('img')
      let src = ''
      if (a) {
        src = a.getAttribute('href')
      }
      return {
        src,
        img: img.getAttribute('src')
      }
    })
  })

  await $.saveFile('./data/index.json', {banners})

  browser.close()
}

const maps = async () => {
  let tlist = []
  const lengths = [14, 15, 13]
  for(var j=0; j<prefix.length;j++){
    for(let i = 0; i< lengths[j]; i++){
      const res = await axios.get(
        `http://${prefix[j]}.shibajiang.com/dworks/list.html?iDisplayStart=${i*6}&iDisplayLength=6&siteId=${j}&curPage=${i}&worksWorksProgress=1&worksType=&styleId=&searchWord=&searchType=&orderBy=&designerType=&worksHouse=&exculde=`
      )
      const data = res.data.data
      const list = _.map(data.aaData, item => {
        return _.assign(item, {
          cityId: j+1
        })
      })
      console.log(prefix[j], i, list.length)
      tlist = tlist.concat(list)
      $.sleep(200)
    }
  }
  console.log(tlist.length)
  await $.saveFile('./data/maps.json', {tlist})
}

const mapsType = async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.emulate(iPhone)
  await page.goto('http://shibajiang.com/h5/link/DJdesigner.html')

  let types = await page.evaluate(() => {
    const getTypes = (p) => {
      var as = [...document.querySelectorAll(`.${p} a`)]
      console.log(as)
      return as.map(item => {
        return {
          label: item.innerText,
          id: item.getAttribute('data-id')
        }
      })
    }
    const manner = getTypes('cation_sele2')
    const space = getTypes('cation_sele3')
    const htype = getTypes('cation_sele4')
    return {
      manner,
      space,
      htype
    }
  })
  await $.saveFile('./data/mapTypes.json', types)

  browser.close()
}


const mapDetail = async () => {
  const slist = await $.readFile('./data/maps.json')
  await $.saveFile('./data/mapDetail.json', [])
  const list = slist.tlist

  for (let i = 0; i<list.length; i++){
    console.log(i, prefix[list[i].cityId-1])
    let all = await $.readFile('./data/mapDetail.json')
    const html = await axios.get(`http://shibajiang.com/h5/detail/${list[i].cityId}/${list[i].worksId}/designWorks/DJdesigner.html`)
    const h = cheerio.load(html.data)
    const imgs = []
    h('.dj-imgbox img').each(function(){
      imgs.push(h(this).attr('src'))
    })
    const address = h('.details p').eq(0).find('span').text()
    const name = h('.details p').eq(1).find('span').text()
    const measure = h('.details p').eq(2).find('span').text().replace(/㎡/ig,'')
    const data = {
      id: list[i].worksId,
      imgs, address, name, measure
    }
    await $.sleep(200)
    all.push(data)
    await $.saveFile('./data/mapDetail.json', all)
  }
}

const desingers = async () => {
  const lengths = [1, 2 , 1]
  let list = []
  for(let j = 0;j<prefix.length;j++){
    for(var i=0;i<lengths[j];i++){
      console.log(i, prefix[j])
      const data = await axios.get(`http://${prefix[j]}.shibajiang.com/designer/list.html?iDisplayStart=${i*9}&iDisplayLength=9&designerSite=${j+1}&curPage=1&worksType=&styleId=&searchWord=&searchType=&orderBy=&designerType=&styleIdList=&houseId=`)

      const pdata = _.map(data.data.data.aaData, item => {
        return _.assign(item, {
          cityId: j+1
        })
      })

      list = list.concat(pdata)
    }
  }
  console.log(list.length)
  await $.saveFile('./data/designers.json', list)
}

const designerDetail = async () => {
  const data = await $.readFile('./data/designers.json')

  const getItem = async (id, pf) => {
    const html = await axios.get(`http://${prefix[pf-1]}.shibajiang.com/h5/detail/${pf}/${id}/designer/designer.html`)
    const h = cheerio.load(html.data)
    const concept = h('.dgmain-data').eq(2).find('p').text()
    const styles = []
    const service = []
    h('.dgmain-data').eq(3).find('b').each(function(){
      styles.push(h(this).text())
    })
    h('.dgmain-data').eq(4).find('b').each(function(){
      service.push(h(this).text())
    })

    return {
      id,
      concept,
      styles,
      service
    }
  }
  const list = []
  for(let i = 0;i<data.length;i++){
    console.log(i, prefix[data[i].cityId-1])
    const item = await getItem(data[i].designerId, data[i].cityId)
    list.push(item)
    await $.sleep(_.random(500))
  }

  await $.saveFile('./data/designerDetail.json', list)
}


const citys = async () => {
  let data = [
    {
      id: 1,
      name: '南京',
      ename: 'nj'
    },
    {
      id: 2,
      name: '武汉',
      ename: 'wh'
    },
    {
      id: 3,
      name: '无锡',
      ename: 'wx'
    }
  ]

  for(let i =0;i<data.length;i++){
    const url = `http://shibajiang.com/findCreaByCity.html?creaCity=${data[i].id}&_=${Date.now()}`
    console.log(url)
    const _data = await axios.get(url)

    data[i].children = _data.data.data
  }

  await $.saveFile('./data/city.json', data)
}

const builds = async () => {
  const data = []
  for(let i =0;i<prefix.length;i++){
    const url = `http://${prefix[i]}.shibajiang.com/h5/link/house.html?siteId=${i+1}`
    const html = await axios.get(url)
    const h = cheerio.load(html.data)
    const list = h('.cation_specail').find('a')
    list.each(function(){
      const id = h(this).attr('data-id')
      if(!id) return
      data.push({
        cityId: i+1,
        id,
        name: h(this).text()
      })
    })
  }
  await $.saveFile('./data/builds.json', data)
}

const designerLeval = async () => {
  const html = await axios.get(`http://nj.shibajiang.com/h5/link/designer.html?siteId=2`)
  const h = cheerio.load(html.data)
  const ls = []
  h('.person-nav').find('li').each(function(){
    const _id = h(this).attr('data-id')
    if(_id){
      ls.push({
        id: parseInt(_id),
        label: h(this).text()
      })
    }
  })

  await $.saveFile('./data/designerLeval.json', ls)
}





const parseMapTypes = async () => {
  const mapTypes = await $.readFile('./data/mapTypes.json')
  let news = {}
  _.forEach(mapTypes, (_item, key) => {
    const _val = _.filter(_item, item => item.id)
    news[key] = _.map(_val, item => {
      return {
        label: item.label,
        id: parseInt(item.id)
      }
    })
  })

  await $.saveFile('./data/parsed/mapTypes.json', news)
}

const parseCity = async () => {
  const citys = await $.readFile('./data/city.json')

  let news = _.map(citys, item => ({
    id: item.id,
    name: item.name,
    ab: item.ename,
    leval: 1
  }))

  _.forEach(citys, _item => {
    _.forEach(_item.children, item => {
      news.push({
        id: item.creaId,
        name: item.creaName,
        ab: item.creaKeyword,
        cityId: _item.id,
        leval: 2
      })
    })
  })

  await $.saveFile('./data/parsed/city.json', news)
}

const parseDesignerLeval = async () => {
  const builds = await $.readFile('./data/designerLeval.json')

  await $.saveFile('./data/parsed/designerLeval.json', builds)
}

const parseBuilds = async () => {
  const builds = await $.readFile('./data/builds.json')
  const news = _.map(builds, item => _.assign(item, {
    id: parseInt(item.id)
  }))
  await $.saveFile('./data/parsed/builds.json', news)
}

const parseDesigners = async () => {
  const designers = await $.readFile('./data/designers.json')
  const designerDetail = await $.readFile('./data/designerDetail.json')
  const designerLeval = await $.readFile('./data/designerLeval.json')
  const mapTypes = await $.readFile('./data/mapTypes.json')
  const builds = await $.readFile('./data/builds.json')
  // 风格
  const manner = mapTypes.manner
  let news = _.uniq(designers, 'designerId')

  news = _.map(news, item => {
    let d = _.find(designerDetail, _item => _item.id === item.designerId)
    d.styles = _.map(d.styles, _item => {
      _p = _.find(manner, __item => _item.match(__item.label))
      return parseInt(_p.id)
    })

    d.service = _.map(d.service, _item => {
      _p = _.find(builds, __item => _item.match(__item.name))
      return parseInt(_p.id)
    })

    const l = _.find(designerLeval, _item => item.designerTypeName.match(_item.label))

    if(d === -1 || l === -1) return
    return _.assign({
      avatar: item.designerIoc,
      name: item.designerName,
      leval: l.id
    }, d)
  })

  await $.saveFile('./data/parsed/designers.json', news)
}


const parseMaps = async () => {
  const mapsData = await $.readFile('./data/maps.json')
  const city = await $.readFile('./data/city.json')
  const builds = await $.readFile('./data/builds.json')
  const mapDetailData = await $.readFile('./data/mapDetail.json')
  const mapTypes = await $.readFile('./data/mapTypes.json')
  // 风格
  const manner = mapTypes.manner
  // 空间
  const space = mapTypes.space
  // 类型
  const htype = mapTypes.htype

  // 去重
  const mapDetail = _.uniq(mapDetailData, 'id')
  let maps = _.uniq(mapsData.tlist, 'worksId')

  console.log(maps.length)
  maps = _.map(maps, item => {
    const build = item.worksTitle
    // console.log(build)
    const _p = _.find(builds, _item => {
      return build.match(_item.name)
    })
    const d = _.find(mapDetail, _item => parseInt(_item.id) === parseInt(item.worksId))
    const c = _.find(city, _item => _item.name.match(item.cityName))
    const cityId = parseInt(c.id)
    const a = _.find(c.children, _item => _item.creaName.match(item.cityCrea))
    const areaId = parseInt(a.creaId)

    let styleId = _.find(manner, _item => _item.label.match(item.styleName)).id
    styleId = parseInt(styleId)


    // console.log(_p, d, a, styleId)
    if(!_p || !d || !a || !styleId) return

    return _.assign({
      buildId: parseInt(_p.id),
      cityId,
      areaId,
      styleId,
      desc: item.worksNote,
      title: build,
      id: d.id,
      images: d.imgs,
      measure: d.measure
    })
  })

  maps = _.filter(maps, item => !!item)

  console.log(maps.length)
  await $.saveFile('./data/parsed/maps.json', maps)
}


// parseMaps()
parseDesignerLeval()
// parseDesigners()
// designerLeval()
// parseBuilds()
// parseCity()
// const designerParse = async () => {
//   const list = await $.readFile('./data/designers.json')
//   const detail = await $.readFile('./data/designerDetail.json')
// }
// parseMapTypes()
// builds()
// citys()
// designerDetail()
// desingers()
// mapsType()
// maps()
// mapDetail()
// index()
