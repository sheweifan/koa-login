import mongoose, { Schema } from 'mongoose'
import { setMeta } from '../utils'
// 设计师
let DesignerSchema = new Schema({
  _id: Number,
  avatar: String,
  name: String,
  city: {
    type: Number,
    ref: 'city'
  },
  leval: {
    type: Number,
    ref: 'designerLeval'
  },
  concept: String,
  styles: [
    {
      type: Number,
      ref: 'style'
    }
  ],
  services: [
    {
      type: Number,
      ref: 'build'
    }
  ],
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

DesignerSchema.pre('save', setMeta)

mongoose.model('designer', DesignerSchema)
