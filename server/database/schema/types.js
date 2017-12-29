import mongoose, { Schema } from 'mongoose'

const type = {
  _id: Number,
  label: String
}

// 风格
let StyleSchema = new Schema(type)

// 空间
let SpaceSchema = new Schema(type)

// 房屋类型
let HouseTypeSchema = new Schema(type)

mongoose.model('style', StyleSchema)
mongoose.model('space', SpaceSchema)
mongoose.model('houseType', HouseTypeSchema)
