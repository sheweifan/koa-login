import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType
} from 'graphql'

import { mapModel } from '../map/model'
import { designerModel } from '../designer/model'

// 轮播图
export let indexSwiperModel = new GraphQLObjectType({
  name: 'indexSwiper',
  fields: {
    _id: {
      type: GraphQLID
    },
    image: {
      type: GraphQLString
    },
    link: {
      type: GraphQLString
    }
  }
})

export let indexSwiperInput = new GraphQLInputObjectType({
  name: 'indexSwiperInput',
  fields: {
    image: {
      type: GraphQLString
    },
    link: {
      type: GraphQLString
    }
  }
})

// 效果图楼层
export let indexMapModel = new GraphQLObjectType({
  name: 'indexMap',
  fields: {
    _id: {
      type: GraphQLID
    },
    map: {
      type: mapModel
    },
    image: {
      type: GraphQLString
    },
    desc: {
      type: GraphQLString
    }
  }
})

export let indexMapInput = new GraphQLInputObjectType({
  name: 'indexMapInput',
  fields: {
    map: {
      type: GraphQLInt
    },
    image: {
      type: GraphQLString
    },
    desc: {
      type: GraphQLString
    }
  }
})

// 设计师楼层
export let indexDesignerModel = new GraphQLObjectType({
  name: 'indexDesigner',
  fields: {
    _id: {
      type: GraphQLID
    },
    designer: {
      type: designerModel
    }
  }
})

export let indexDesignerInput = new GraphQLInputObjectType({
  name: 'indexDesignerInput',
  fields: {
    designer: {
      type: GraphQLInt
    }
  }
})
