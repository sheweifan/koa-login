import mongoose, { Schema } from 'mongoose'
import { setMeta, metaType } from '../utils'

// 轮播图
let IndexSwiperSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  ...metaType
})

// 效果图楼层
let IndexMapSchema = new Schema({
  map: {
    type: Number,
    ref: 'map',
    required: true
  },
  image: {
    type: String
  },
  desc: {
    type: String,
    required: true
  },
  ...metaType
})

// 设计师楼层
let IndexDesignerSchema = new Schema({
  designer: {
    type: Number,
    ref: 'designer',
    required: true
  },
  ...metaType
})

IndexSwiperSchema.pre('save', setMeta)
IndexMapSchema.pre('save', setMeta)
IndexDesignerSchema.pre('save', setMeta)

// 验证效果图id是不是存在
IndexMapSchema.pre('save', async function (next) {
  const Maps = mongoose.model('map')
  const map = await Maps.findOne({_id: this.map}).exec()
  if (map) {
    next()
  } else {
    const err = new Error('输入的id不存在')
    next(err)
  }
})

// 验证设计师id是不是存在
IndexDesignerSchema.pre('save', async function (next) {
  const Designer = mongoose.model('designer')
  const designer = await Designer.findOne({_id: this.designer}).exec()
  if (designer) {
    next()
  } else {
    const err = new Error('输入的id不存在')
    next(err)
  }
})

mongoose.model('indexSwiper', IndexSwiperSchema)
mongoose.model('indexMap', IndexMapSchema)
mongoose.model('indexDesigner', IndexDesignerSchema)
