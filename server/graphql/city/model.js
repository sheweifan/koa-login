import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} from 'graphql'

const fields = {
  _id: {
    type: GraphQLID
  },
  name: {
    type: GraphQLString
  },
  ab: {
    type: GraphQLString
  },
  leval: {
    type: GraphQLInt
  },
  parentId: {
    type: GraphQLInt
  }
}

export let cityModel = new GraphQLObjectType({
  name: 'city',
  fields
})
