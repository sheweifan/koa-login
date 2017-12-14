import mongoose, { Schema } from 'mongoose'
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

DesignerSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('designer', DesignerSchema)
