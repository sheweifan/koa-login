import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString
} from 'graphql'

const fields = {
  _id: {
    type: GraphQLID
  },
  label: {
    type: GraphQLString
  }
}

export let typeModel = new GraphQLObjectType({
  name: 'type',
  fields
})
