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

export let designersModel = new GraphQLObjectType({
  name: 'designers',
  fields: {
    totalCount: {
      type: GraphQLInt
    },
    list: {
      type: new GraphQLList(designerModel)
    }
  }
})

export let designerInput = new GraphQLInputObjectType({
  name: 'xgtItemInput',
  fields: {
    avatar: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    city: {
      type: GraphQLInt
    },
    concept: {
      type: GraphQLString
    },
    leval: {
      type: GraphQLInt
    },
    styles: {
      type: new GraphQLList(GraphQLInt)
    },
    services: {
      type: new GraphQLList(GraphQLInt)
    }
  }
})
