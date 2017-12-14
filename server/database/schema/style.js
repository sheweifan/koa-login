import mongoose, { Schema } from 'mongoose'
// 风格
let StyleSchema = new Schema({
  _id: Number,
  label: String
})

mongoose.model('style', StyleSchema)
