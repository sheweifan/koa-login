import mongoose, { Schema } from 'mongoose'
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

MapSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

MapSchema.pre('save', function (next) {
})

mongoose.model('map', MapSchema)
