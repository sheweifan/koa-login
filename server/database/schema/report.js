import mongoose, { Schema } from 'mongoose'
import { setMeta, metaType, getList } from '../utils'
// 新闻
let ReportSchema = new Schema({
  title: String,
  context: String,
  city: {
    type: Number,
    ref: 'city'
  },
  ...metaType
})

ReportSchema.pre('save', setMeta)

ReportSchema.statics = {
  getList
}

mongoose.model('report', ReportSchema)
