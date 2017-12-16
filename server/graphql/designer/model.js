import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString
} from 'graphql'

import { cityModel } from '../city/model'
import { typeModel } from '../types/model'
import { buildModel } from '../build/model'

export let designerLevalModel = new GraphQLObjectType({
  name: 'designerLeval',
  fields: {
    _id: {
      type: GraphQLID
    },
    label: {
      type: GraphQLString
    }
  }
})

export let designerModel = new GraphQLObjectType({
  name: 'designer',
  fields: {
    _id: {
      type: GraphQLID
    },
    avatar: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    city: {
      type: cityModel
    },
    concept: {
      type: GraphQLString
    },
    leval: {
      type: designerLevalModel
    },
    styles: {
      type: new GraphQLList(typeModel)
    },
    services: {
      type: new GraphQLList(buildModel)
    }
  }
})
