import axios from 'axios'
import _map from 'lodash/map'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'
import _compact from 'lodash/compact'
import _forEach from 'lodash/forEach'
import _capitalize from 'lodash/capitalize'

const baseurl = ''
// Graphql value parser
const Gparse = (value) => {
  if (_isArray(value)) {
    return JSON.stringify(value)
  } else if (_isObject(value)) {
    return Gstringify(value)
  } else if (_isNumber(value)) {
    return value
  } else if (_isString(value)) {
    // return `"${value}"`
    return `"${value.replace(/[\n\r]/g, '\\n')}"`
  } else {
    return null
  }
}
// Graphql stringify
const Gstringify = (data) => {
  return `{
    ${_map(data, (value, key) => {
      if (key === '_id') return null
      const val = Gparse(value)
      return val ? `${key}: ${val} ` : null
    }).join('\n')}
  }`
}

class Services {
  // 获取7牛上传token
  getQiniuToken (key) {
    return axios.get(`${baseurl}/qiniu/getToken?key=${key}`)
  }
  // 获得各种类型
  getTypes () {
    return axios.get(baseurl + '/graphql', {
      params: {
        query: `{
          styles {
            _id
            label
          }
          spaces {
            _id
            label
          }
          houseTypes {
            _id
            label
          }
          citys {
            _id
            name
            ab
            leval
            parentId
          }
          builds {
            _id
            name
            city {
              _id
            }
          }
          designerLeval {
            _id
            label
          }
        }`
      }
    })
  }
  // 数据接口
  async _getLists (apiName, {pageIndex, keys, query}) {
    const {data: {data: {data}}} = await axios.get(baseurl + '/graphql', {
      params: {
        query: `{
          data: ${apiName}s (pageIndex: ${pageIndex}${query ? ',query:' + Gstringify(query) : ''}) {
            totalCount
            list {
              ${keys}
            }
          }
        }`
      }
    })
    return data
  }
  // 更新或者创建数据
  async _put (apiName, data) {
    const mutation = data._id
    ? `${apiName}Update(data: ${Gstringify(data)}, _id: ${Gparse(data._id)})`
    : `${apiName}Create(data: ${Gstringify(data)})`
    const ret = await axios.post(baseurl + '/graphql', {
      query: `mutation {
        res: ${mutation}
      }`
    })
    return ret.data.data.res
  }
  // 删除数据
  async _del (apiName, _id) {
    const ret = await axios.post(baseurl + '/graphql', {
      query: `mutation {
        res: ${apiName}Remove(_id: ${_id})
      }`
    })
    return ret.data.data.res
  }
  // 首页数据
  async getIndexData () {
    const {data: {data}} = await axios.get(baseurl + '/graphql', {
      params: {
        query: `{
          swiper: indexSwiper {
            _id
            image
            link
          }
          map: indexMap {
            _id
            image
            desc
            map {
              _id
            }
          }
          designer: indexDesigner {
            _id
            designer {
              _id
              styles {
                _id
                label
              }
              name
            }
          }
        }`
      }
    })
    return data
  }
  // 修改首页轮播
  async putIndexSwiper (data) {
    return this._put('indexSwiper', data)
  }
  // 删除首页轮播
  async delIndexSwiper (data) {
    return this._del('indexSwiper', data)
  }
}

const apiNames = ['designer', 'map']
_forEach(apiNames, item => {
  const name = _capitalize(item)
  Services.prototype[`get${name}s`] = function (data) {
    return this._getLists(item, data)
  }
  Services.prototype[`put${name}`] = function (data) {
    return this._put(item, data)
  }
  Services.prototype[`del${name}`] = function (_id) {
    return this._del(item, _id)
  }
})

export default new Services()
