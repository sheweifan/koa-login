import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import _ from 'lodash'

import typeQuery from './types/query'
import cityQuery from './city/query'
import buildQuery from './build/query'
import designerQuery from './designer/query'

import designerMutation from './designer/mutation'

const queryFields = {
  ...typeQuery,
  ...cityQuery,
  ...buildQuery,
  ...designerQuery
}
const mutationFields = {
  ...designerMutation
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: queryFields
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMotationType',
    fields: mutationFields
  })
})
