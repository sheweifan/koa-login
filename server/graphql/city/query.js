import mongoose from 'mongoose'
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  cityModel
} from './model'

const city = mongoose.model('city')

const citysQuery = {
  type: new GraphQLList(cityModel),
  args: {},
  resolve (root, params, options) {
    return city.find({}).exec()
  }
}

const cityQuery = {
  type: cityModel,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, {_id}, options) {
    return city.findOne({_id}).exec()
  }
}

export default {
  city: cityQuery,
  citys: citysQuery
}
