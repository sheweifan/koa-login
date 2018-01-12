import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

const returnType = new GraphQLObjectType({
  name: 'returnType',
  fields: {
    success: {
      type: GraphQLBoolean
    },
    message: {
      type: GraphQLString
    }
  }
})

export const getUpdate = (Entity, input, idType = GraphQLID) => ({
  type: returnType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(idType)
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(input)
    }
  },
  async resolve (root, { _id, data }, options) {
    try {
      delete data._id
      await Entity.update({_id}, {$set: data})
      return {
        success: true
      }
    } catch (e) {
      return {
        success: true,
        message: e
      }
    }
  }
})

export const getCreate = (Entity, input) => ({
  type: returnType,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(input)
    }
  },
  async resolve (root, { data }, options) {
    try {
      delete data._id
      const newOne = new Entity(data)
      await newOne.save()
      return {
        success: true
      }
    } catch (e) {
      return {
        success: true,
        message: e
      }
    }
  }
})

export const getRemove = (Entity, idType = GraphQLID) => ({
  type: returnType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(idType)
    }
  },
  async resolve (root, { _id }, options) {
    try {
      Entity.remove({_id}).exec()
      return {
        success: true
      }
    } catch (e) {
      return {
        success: true,
        message: e
      }
    }
  }
})

export default (Entity, input, idType = GraphQLID) => {
  return {
    update: getUpdate(Entity, input, idType),
    create: getCreate(Entity, input),
    remove: getRemove(Entity, idType)
  }
}
