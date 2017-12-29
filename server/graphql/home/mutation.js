import mongoose from 'mongoose'

import {
  indexSwiperInput,
  indexMapInput,
  indexDesignerInput
} from './model'

import cud from '../utils/CUD'

const IndexSwiper = mongoose.model('indexSwiper')
const IndexMap = mongoose.model('indexMap')
const IndexDesigner = mongoose.model('indexDesigner')

const indexSwiperCud = cud(IndexSwiper, indexSwiperInput)
const indexMapCud = cud(IndexMap, indexMapInput)
const indexDesignerCud = cud(IndexDesigner, indexDesignerInput)

export default {
  indexSwiperUpdate: indexSwiperCud.update,
  indexSwiperRemove: indexSwiperCud.remove,
  indexSwiperCreate: indexSwiperCud.create,

  indexMapUpdate: indexMapCud.update,
  indexMapRemove: indexMapCud.remove,
  indexMapCreate: indexMapCud.create,

  indexDesignerUpdate: indexDesignerCud.update,
  indexDesignerRemove: indexDesignerCud.remove,
  indexDesignerCreate: indexDesignerCud.create
}
