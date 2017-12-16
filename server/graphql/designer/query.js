import mongoose from 'mongoose'
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  designerModel,
  designerLevalModel
} from './model'

const designer = mongoose.model('designer')
const designerLeval = mongoose.model('designerLeval')

const designersQuery = {
  type: new GraphQLList(designerModel),
  args: {},
  resolve (root, params, options) {
    return designer.find({})
      .populate('city designerLeval styles services')
      .exec()
  }
}

const designerQuery = {
  type: designerModel,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, {_id}, options) {
    return designer.findOne({_id})
    .populate('city designerLeval styles services')
    .exec()
  }
}

const designerLevalQuery = {
  type: new GraphQLList(designerLevalModel),
  args: {},
  resolve (root, params, options) {
    return designer.find().exec()
  }
}

export default {
  designer: designerQuery,
  designers: designersQuery,
  designerLeval: designerLevalQuery
}
