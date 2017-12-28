import mongoose, { Schema } from 'mongoose'
import { setMeta, getList, addCountId } from '../utils'
const { ObjectId } = Schema
// 设计师
let DesignerSchema = new Schema({
  _id: {
    type: Number,
    index: true
  },
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: Number,
    ref: 'city',
    required: true
  },
  leval: {
    type: Number,
    ref: 'designerLeval',
    required: true
  },
  concept: String,
  styles: [
    {
      type: Number,
      ref: 'style',
      required: true
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

// DesignerSchema.index({
//   name: 'text'
// })

DesignerSchema.index({
  _id: 1
})

DesignerSchema.pre('save', setMeta)

DesignerSchema.pre('save', addCountId)

DesignerSchema.statics = {
  getList
}

mongoose.model('designer', DesignerSchema)
