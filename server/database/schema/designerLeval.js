import mongoose, { Schema } from 'mongoose'
// 设计师等级
let DesignerLevalSchema = new Schema({
  _id: Number,
  label: String
})

mongoose.model('designerLeval', DesignerLevalSchema)
