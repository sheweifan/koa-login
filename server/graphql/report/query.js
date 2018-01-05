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
  reportModel,
  reportsModel
} from './model'

const Report = mongoose.model('report')

const reportsQuery = {
  type: reportsModel,
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
    return Report.getList(pageIndex, pageSize, query, 'city')
  }
}

const reportQuery = {
  type: reportsModel,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  resolve (root, {_id}, options) {
    return Report.findOne({_id})
    .populate('city')
    .exec()
  }
}

export default {
  report: reportQuery,
  reports: reportsQuery
}
