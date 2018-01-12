import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'

import { cityModel } from '../city/model'
import { metaModal } from '../types/model'

export let quoteModel = new GraphQLObjectType({
  name: 'quote',
  fields: {
    _id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    city: {
      type: GraphQLInt
    },
    area: {
      type: GraphQLInt
    },
    state: {
      type: GraphQLInt
    },
    mark: {
      type: GraphQLString
    },
    meta: {
      type: metaModal
    }
  }
})

export let quotesModel = new GraphQLObjectType({
  name: 'quotes',
  fields: {
    totalCount: {
      type: GraphQLInt
    },
    list: {
      type: new GraphQLList(quoteModel)
    }
  }
})

export let quoteInput = new GraphQLInputObjectType({
  name: 'quoteInput',
  fields: {
    state: {
      type: GraphQLInt
    }
  }
})
