import {
  GraphQLInt
} from 'graphql'

import mongoose from 'mongoose'

import {
  quoteInput
} from './model'

import cud from '../utils/CUD'

const quote = mongoose.model('quote')

const quoteCud = cud(quote, quoteInput, GraphQLInt)

export default {
  quoteUpdate: quoteCud.update,
  quoteCreate: quoteCud.create
}
