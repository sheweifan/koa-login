import mongoose, { Schema } from 'mongoose'
import { setMeta, getList, addCountId, metaType } from '../utils'
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
  ...metaType
})

// 设计师等级
let DesignerLevalSchema = new Schema({
  _id: Number,
  label: String
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
mongoose.model('designerLeval', DesignerLevalSchema)
