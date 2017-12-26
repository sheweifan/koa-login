import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType
} from 'graphql'

import mongoose from 'mongoose'

import {
  mapInput
} from './model'

const Map = mongoose.model('map')

const mapUpdate = {
  type: GraphQLBoolean,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(mapInput)
    }
  },
  async resolve (root, { _id, data }, options) {
    try {
      delete data._id
      await Map.update({_id}, {$set: data})
      return true
    } catch (e) {
      return false
    }
  }
}

const mapCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(mapInput)
    }
  },
  async resolve (root, { data }, options) {
    try {
      delete data._id
      const newmap = new Map(data)
      await newmap.save()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

const mapRemove = {
  type: GraphQLBoolean,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve (root, { _id }, options) {
    try {
      Map.remove({_id}).exec()
      return true
    } catch (e) {
      return false
    }
  }
}

export default {
  mapUpdate,
  mapRemove,
  mapCreate
}
