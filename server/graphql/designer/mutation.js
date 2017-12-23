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
  designerInput
} from './model'

const Designer = mongoose.model('designer')

const designerUpdate = {
  type: GraphQLBoolean,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(designerInput)
    }
  },
  async resolve (root, { id, data }, options) {
    try {
      delete data._id
      await Designer.update({_id: id}, {$set: data})
      return true
    } catch (e) {
      return false
    }
  }
}

const designerCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(designerInput)
    }
  },
  async resolve (root, { data }, options) {
    try {
      delete data._id
      const newDesigner = new Designer(data)
      await newDesigner.save()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

const designerRemove = {
  type: GraphQLBoolean,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve (root, { _id }, options) {
    try {
      Designer.remove({_id}).exec()
      return true
    } catch (e) {
      return false
    }
  }
}

export default {
  designerUpdate,
  designerRemove,
  designerCreate
}
