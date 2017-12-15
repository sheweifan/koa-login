import { graphQLSchema } from 'graphql'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import api from '../api'
import { controller, all, get } from '../decorators/router'
import graphqlSchema from '../graphql/schema'

@controller('')
export class Graphql {
  @all('/graphql')
  async graphql (ctx, next) {
    return graphqlKoa({schema: graphqlSchema})(ctx, next)
  }
  @get('/graphiql')
  async graphiql (ctx, next) {
    return graphiqlKoa({endpointURL: '/graphql'})(ctx, next)
  }
}
