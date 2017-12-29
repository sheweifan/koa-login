import mongoose from 'mongoose'

export const metaType = {
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
}

export const setMeta = function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
}

/**
 * 分页方法
 * @param {Number} pageIndex 页码
 * @param {Number} pageSize 每页个数
 * @param {Object} query 筛选项
 * @param {String} populate 关联字段
 */
export const getList = async function (pageIndex = 1, pageSize = 10, query = {}, populate = '') {
  const list = await this.find(query)
    .populate(populate)
    .skip(pageSize * (pageIndex - 1))
    .limit(pageSize)
    .exec()
  const totalCount = await this.find(query)
    .populate(populate)
    .count()
    .exec()
  return {
    list,
    totalCount
  }
}

export const addCountId = async function (next) {
  const Counter = mongoose.model('counter')
  this._id = await Counter.getCount()
  next()
}
