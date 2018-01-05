import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import _ from 'lodash'

import typeQuery from './types/query'
import cityQuery from './city/query'
import buildQuery from './build/query'
import designerQuery from './designer/query'
import mapQuery from './map/query'
import homeQuery from './home/query'
import reportQuery from './report/query'

import designerMutation from './designer/mutation'
import mapMutation from './map/mutation'
import homeMutation from './home/mutation'
import reportMutation from './report/mutation'

const queryFields = {
  ...typeQuery,
  ...cityQuery,
  ...buildQuery,
  ...mapQuery,
  ...homeQuery,
  ...reportQuery,
  ...designerQuery
}
const mutationFields = {
  ...mapMutation,
  ...homeMutation,
  ...reportMutation,
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
