import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import _ from 'lodash'
import config from '../config'

const modals = resolve(__dirname, '../database/schema')

const initUser = async () => {
  const User = mongoose.model('user')
  const user = await User.findOne({
    email: 'sheweifan@qq.com'
  }).exec()
  if (!user) {
    const newUser = new User({
      email: 'sheweifan@qq.com',
      password: 'sheweifan',
      role: 'admin'
    })
    await newUser.save()

    console.log('admin is saved, email: sheweifan@qq.com password: sheweifan')
  }
}

const getDataPath = (name) => resolve(__dirname, `../cralwer/data/parsed/${name}.json`)
const types = require(getDataPath('mapTypes'))
const designer = require(getDataPath('designers.parsed'))
const oldDesigner = require(resolve(__dirname, `../cralwer/data/designers.json`))
const designerLeval = require(getDataPath('designerLeval'))
const build = require(getDataPath('builds'))
const city = require(getDataPath('city'))
const map = require(getDataPath('maps.parsed'))

const initMapTypes = async () => {
  const {manner, space, htype} = types
  const Style = mongoose.model('style')
  const Space = mongoose.model('space')
  const HouseType = mongoose.model('houseType')

  const nowStyles = await Style.find({}).exec()
  if (nowStyles.length === 0) {
    console.log('没有风格， 插入风格')
    const parseStyle = _.map(manner, ({id, label}) => ({
      _id: id,
      label
    }))
    await Style.insertMany(parseStyle)
    console.log('插入风格完成')
  }

  const nowSpaces = await Space.find({}).exec()
  if (nowSpaces.length === 0) {
    console.log('没有空间， 插入空间')
    const parseSpace = _.map(space, ({id, label}) => ({
      _id: id,
      label
    }))
    await Space.insertMany(parseSpace)
    console.log('插入空间完成')
  }

  const nowHouseType = await HouseType.find({}).exec()
  if (nowHouseType.length === 0) {
    console.log('没有户型， 插入户型')
    const parseHouseType = _.map(space, ({id, label}) => ({
      _id: id,
      label
    }))
    await HouseType.insertMany(parseHouseType)
    console.log('插入户型完成')
  }
}

const initMap = async () => {
  const Map = mongoose.model('map')

  const nowMap = await Map.find({}).exec()
  if (nowMap.length === 0) {
    console.log('没有效果图， 插入效果图')
    // console.log(map.length)
    let parseMap = _.uniq(map, 'id')
    // console.log(parseMap.length)
    parseMap = _.map(parseMap, ({id, designer, buildId, cityId, areaId, styleId, desc, title, images, measure}) => ({
      _id: id,
      build: buildId,
      city: (cityId + 1000),
      area: areaId,
      style: styleId,
      desc,
      title,
      designer,
      images,
      measure
    }))
    await Map.insertMany(parseMap)
    console.log('插入效果图完成')
  }
  // const data = await Map.find({}).populate('city').exec()
  // console.log(123123123, JSON.stringify(data))
}

const initBuild = async () => {
  const Build = mongoose.model('build')
  const nowBuild = await Build.find({}).exec()

  if (nowBuild.length === 0) {
    console.log('没有楼盘， 插入楼盘')
    const parseBuild = _.map(build, ({id, cityId, name}) => ({
      _id: id,
      name,
      city: (1000 + cityId)
    }))
    await Build.insertMany(parseBuild)
    console.log('插入楼盘完成')
  }
  // const data = await Build.find({}).populate('city')
  // console.log(data)
}

const initCity = async () => {
  const City = mongoose.model('city')
  const nowCity = await City.find({}).exec()

  if (nowCity.length === 0) {
    console.log('没有城市， 插入城市')
    const parseCity = _.map(city, ({id, name, ab, cityId, leval}) => ({
      _id: cityId ? id : id + 1000,
      name,
      ab,
      leval,
      parentId: cityId ? (cityId + 1000) : null
    }))
    await City.insertMany(parseCity)
    console.log('插入城市完成')
  }
}

const initDesigner = async () => {
  const DesingerLeval = mongoose.model('designerLeval')
  const Desinger = mongoose.model('designer')

  const nowDesingerLeval = await DesingerLeval.find({}).exec()
  if (nowDesingerLeval.length === 0) {
    console.log('没有设计师等级， 插入设计师等级')

    const parseDesignerLeval = _.map(designerLeval, ({id, label}) => ({
      _id: id,
      label
    }))
    await DesingerLeval.insertMany(parseDesignerLeval)
    console.log('插入设计师等级完成')
  }

  const nowDesinger = await Desinger.find({}).exec()
  if (nowDesinger.length === 0) {
    console.log('没有设计师， 插入设计师')
    const parseDesignerLeval = _.map(designer, ({id, avatar, name, leval, concept, styles, service}, index) => ({
      _id: id,
      avatar,
      city: (oldDesigner[index].cityId + 1000),
      name,
      leval,
      concept,
      styles,
      services: service
    }))
    // console.log(JSON.stringify(parseDesignerLeval))
    await Desinger.insertMany(parseDesignerLeval)
    console.log('插入设计师完成')
  }
  // const data = await Desinger.find({}).populate('city').exec()
  // console.log(JSON.stringify(data))
}

const initCounter = async () => {
  const Counter = mongoose.model('counter')

  const nowCounter = await Counter.find({}).exec()
  if (nowCounter.length === 0) {
    console.log('没有计数器， 插入计数器')
    const newCount = new Counter({count: 2000})
    await newCount.save()
    console.log('插入计数器完成')
  }
  // const now = await Counter.getCount()
}

const initQuoteState = async () => {
  const states = [
    {_id: 1, label: '未回访'},
    {_id: 2, label: '未回访-无人接听'},
    {_id: 3, label: '已回访-无意向'},
    {_id: 4, label: '已回访-号码非本人'},
    {_id: 5, label: '已回访-稍后联系'}
  ]
  const QuoteState = mongoose.model('quoteState')
  const nowCounter = await QuoteState.find({}).exec()
  if (nowCounter.length === 0) {
    console.log('没有报名状态， 插入报名状态')
    await QuoteState.insertMany(states)
    console.log('插入报名状态完成')
  }
}
const initData = async () => {
  await initUser()
  await initMapTypes()
  await initDesigner()
  await initCity()
  await initBuild()
  await initMap()
  await initCounter()
  await initQuoteState()
}

fs.readdirSync(modals)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(modals, file)))

export const database = app => {
  mongoose.set('debug', !(app.env === 'production'))
  mongoose.Promise = global.Promise
  mongoose.connect(config.db, {
    useMongoClient: true
  })

  mongoose.connection.on('disconneted', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('err', err => console.log(err))
  mongoose.connection.on('open', () => {
    console.log('connected to db', config.db)

    initData()
  })
}
