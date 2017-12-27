import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString
} from 'graphql'

const fields = {
  _id: {
    type: GraphQLInt
  },
  label: {
    type: GraphQLString
  }
}

export let typeModel = new GraphQLObjectType({
  name: 'type',
  fields
})
