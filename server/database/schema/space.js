import mongoose, { Schema } from 'mongoose'
// 空间
let SpaceSchema = new Schema({
  _id: Number,
  label: String
})

mongoose.model('space', SpaceSchema)
