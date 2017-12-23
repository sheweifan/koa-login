import mongoose, { Schema } from 'mongoose'
// 城市
let counterSchema = new Schema({
  _id: {
    type: Number,
    default: 1
  },
  count: {
    type: Number,
    default: 2000
  }
})

counterSchema.statics = {
  async getCount () {
    const counter = await this.findOne({_id: 1}).exec()
    const now = counter.count + 1
    await this.update({_id: 1}, {
      $set: {
        count: now
      }
    })
    return now
  }
}

mongoose.model('counter', counterSchema)
