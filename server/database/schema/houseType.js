import mongoose, { Schema } from 'mongoose'
// 房屋类型
let HouseTypeSchema = new Schema({
  _id: Number,
  label: String
})

mongoose.model('houseType', HouseTypeSchema)
