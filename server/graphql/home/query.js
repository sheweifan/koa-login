import mongoose from 'mongoose'
import {
  indexSwiperModel,
  indexMapModel,
  indexDesignerModel
} from './model'

const IndexSwiper = mongoose.model('indexSwiper')
const IndexMap = mongoose.model('indexMap')
const IndexDesigner = mongoose.model('indexDesigner')

const indexSwiperQuery = {
  type: indexSwiperModel,
  args: {},
  resolve (root, params, options) {
    return IndexSwiper.find({}).exec()
  }
}

const indexMapQuery = {
  type: indexMapModel,
  args: {},
  resolve (root, params, options) {
    return IndexMap
      .find({})
      .populate('map')
      .exec()
  }
}

const indexDesignerQuery = {
  type: indexDesignerModel,
  args: {},
  resolve (root, params, options) {
    return IndexDesigner
      .find({})
      .populate('designer')
      .exec()
  }
}

export default {
  indexSwiper: indexSwiperQuery,
  indexMap: indexMapQuery,
  indexDesigner: indexDesignerQuery
}
