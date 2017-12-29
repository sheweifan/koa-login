import {
  GraphQLInt
} from 'graphql'

import mongoose from 'mongoose'

import {
  designerInput
} from './model'

import cud from '../utils/CUD'

const Designer = mongoose.model('designer')

const designerCud = cud(Designer, designerInput, GraphQLInt)

export default {
  designerUpdate: designerCud.update,
  designerRemove: designerCud.remove,
  designerCreate: designerCud.create
}
