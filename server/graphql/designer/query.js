import mongoose from 'mongoose'
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString
} from 'graphql'

import {
  designerModel,
  designersModel,
  designerLevalModel
} from './model'

const designer = mongoose.model('designer')
const designerLeval = mongoose.model('designerLeval')
const populate = {
  path: 'city leval styles services services',
  populate: {
    path: 'city'
  }
}

const designersQuery = {
  type: designersModel,
  args: {
    query: {
      type: GraphQLString
    },
    pageIndex: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    pageSize: {
      type: GraphQLInt
    }
  },
  resolve (root, {pageIndex, pageSize, query}, options) {
    const textObj = {
      $text: {
        $search: query
      }
    }
    const _query = query ? textObj : {}
    return designer.getList(pageIndex, pageSize, _query, populate)
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
    .populate(populate)
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
