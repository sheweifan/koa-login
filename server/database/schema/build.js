import mongoose, { Schema } from 'mongoose'
// 楼盘
let BuildTypeSchema = new Schema({
  _id: Number,
  name: String,
  city: {
    type: Number,
    ref: 'city'
  }
})

mongoose.model('build', BuildTypeSchema)
