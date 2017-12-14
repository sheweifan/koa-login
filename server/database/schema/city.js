import mongoose, { Schema } from 'mongoose'
// 城市
let CitySchema = new Schema({
  _id: Number,
  name: String,
  ab: String,
  leval: Number,
  parentId: Number
})

mongoose.model('city', CitySchema)
