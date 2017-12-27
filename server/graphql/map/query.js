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
  mapModel,
  mapsModel
} from './model'

const map = mongoose.model('map')
const populate = {
  path: 'build city area style designer',
  populate: {
    path: 'city'
  }
}

const mapsQuery = {
  type: mapsModel,
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
    return map.getList(pageIndex, pageSize, _query, populate)
  }
}

const mapQuery = {
  type: mapModel,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, {_id}, options) {
    return map.findOne({_id})
    .populate(populate)
    .exec()
  }
}

export default {
  map: mapQuery,
  maps: mapsQuery
}
