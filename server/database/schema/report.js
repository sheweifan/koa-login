import mongoose, { Schema } from 'mongoose'
import { setMeta, metaType, getList } from '../utils'
// 新闻
let ReportSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  city: {
    type: Number,
    ref: 'city',
    required: true
  },
  ...metaType
})

ReportSchema.pre('save', setMeta)

ReportSchema.statics = {
  getList
}

mongoose.model('report', ReportSchema)
