import mongoose, { Schema } from 'mongoose'
import { setMeta, metaType, getList } from '../utils'
// 报名
let QuoteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: Number,
    required: true,
    ref: 'city'
  },
  area: {
    type: Number,
    required: true,
    ref: 'city'
  },
  state: {
    type: Number,
    default: 1,
    ref: 'quoteState'
  },
  mark: {
    type: String
  },
  ...metaType
})

// 报名状态
let QuoteStateSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

QuoteSchema.pre('save', setMeta)

QuoteSchema.statics = {
  getList
}

mongoose.model('quote', QuoteSchema)
mongoose.model('quoteState', QuoteStateSchema)
