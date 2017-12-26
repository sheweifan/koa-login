import mongoose, { Schema } from 'mongoose'
import { setMeta, getList, addCountId } from '../utils'
// 效果图
let MapSchema = new Schema({
  _id: Number,
  build: {
    type: Number,
    ref: 'build'
  },
  city: {
    type: Number,
    ref: 'city'
  },
  area: {
    type: Number,
    ref: 'city'
  },
  style: {
    type: Number,
    ref: 'style'
  },
  title: String,
  desc: String,
  images: [String],
  measure: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MapSchema.pre('save', setMeta)

MapSchema.pre('save', addCountId)

MapSchema.statics = {
  getList
}

mongoose.model('map', MapSchema)
