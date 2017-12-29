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

mongoose.model('indexSwiper', IndexSwiperSchema)
mongoose.model('indexMap', IndexMapSchema)
mongoose.model('indexDesigner', IndexDesignerSchema)
