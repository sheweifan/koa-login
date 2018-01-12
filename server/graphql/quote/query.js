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
  quotesModel
} from './model'

import { typeModel } from '../types/model'

const Quote = mongoose.model('quote')
const QuoteState = mongoose.model('quoteState')
const populate = 'city area style quoteState'

const quotesQuery = {
  type: quotesModel,
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
  resolve (root, {pageIndex, pageSize, query = {}}, options) {
    return Quote.getList(pageIndex, pageSize, query, populate)
  }
}

const quoteStateQuery = {
  type: new GraphQLList(typeModel),
  args: {},
  resolve () {
    return QuoteState.find({}).exec()
  }
}

// const quoteQuery = {
//   type: quoteModel,
//   args: {
//     _id: {
//       type: new GraphQLNonNull(GraphQLInt)
//     }
//   },
//   resolve (root, {_id}, options) {
//     return quote.findOne({_id})
//     .populate(populate)
//     .exec()
//   }
// }

export default {
  quoteState: quoteStateQuery,
  quotes: quotesQuery
}
