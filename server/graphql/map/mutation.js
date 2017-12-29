import {
  GraphQLInt
} from 'graphql'

import mongoose from 'mongoose'

import {
  mapInput
} from './model'

import cud from '../utils/CUD'

const map = mongoose.model('map')

const mapCud = cud(map, mapInput, GraphQLInt)

export default {
  mapUpdate: mapCud.update,
  mapRemove: mapCud.remove,
  mapCreate: mapCud.create
}
