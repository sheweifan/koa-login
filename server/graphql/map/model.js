import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'

import { cityModel } from '../city/model'
import { typeModel } from '../types/model'
import { buildModel } from '../build/model'
import { designerModel } from '../designer/model'

export let mapModel = new GraphQLObjectType({
  name: 'map',
  fields: {
    _id: {
      type: GraphQLInt
    },
    build: {
      type: buildModel
    },
    city: {
      type: cityModel
    },
    area: {
      type: cityModel
    },
    designer: {
      type: designerModel
    },
    style: {
      type: typeModel
    },
    title: {
      type: GraphQLString
    },
    desc: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString)
    },
    measure: {
      type: GraphQLInt
    }
  }
})

export let mapsModel = new GraphQLObjectType({
  name: 'maps',
  fields: {
    totalCount: {
      type: GraphQLInt
    },
    list: {
      type: new GraphQLList(mapModel)
    }
  }
})

export let mapInput = new GraphQLInputObjectType({
  name: 'mapInput',
  fields: {
    build: {
      type: GraphQLInt
    },
    city: {
      type: GraphQLInt
    },
    designer: {
      type: GraphQLInt
    },
    area: {
      type: GraphQLInt
    },
    style: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    desc: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString)
    },
    measure: {
      type: GraphQLInt
    }
  }
})
