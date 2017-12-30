import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType
} from 'graphql'

export const getUpdate = (Entity, input, idType = GraphQLID) => ({
  type: GraphQLBoolean,
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
      return true
    } catch (e) {
      return false
    }
  }
})

export const getCreate = (Entity, input) => ({
  type: GraphQLBoolean,
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
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
})

export const getRemove = (Entity, idType = GraphQLID) => ({
  type: GraphQLBoolean,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(idType)
    }
  },
  async resolve (root, { _id }, options) {
    try {
      Entity.remove({_id}).exec()
      return true
    } catch (e) {
      return false
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
