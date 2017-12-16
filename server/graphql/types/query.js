import mongoose from 'mongoose'
import {
  GraphQLList
} from 'graphql'

import {
  typeModel
} from './model'

const style = mongoose.model('style')
const space = mongoose.model('space')
const houseType = mongoose.model('houseType')

const styleQuery = {
  type: new GraphQLList(typeModel),
  args: {},
  resolve (root, params, options) {
    return style.find({}).exec()
  }
}

const spaceQuery = {
  type: new GraphQLList(typeModel),
  args: {},
  resolve (root, params, options) {
    return space.find({}).exec()
  }
}

const houseTypeQuery = {
  type: new GraphQLList(typeModel),
  args: {},
  resolve (root, params, options) {
    return houseType.find({}).exec()
  }
}

export default {
  styles: styleQuery,
  spaces: spaceQuery,
  houseTypes: houseTypeQuery
}
