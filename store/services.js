import axios from 'axios'
import _map from 'lodash/map'
import _findIndex from 'lodash/findIndex'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'
import _compact from 'lodash/compact'
import _forEach from 'lodash/forEach'
import _upperFirst from 'lodash/upperFirst'

const baseurl = 'http://localhost:3000'
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
    const val = value.replace(/[\n\r]/g, '\\n') // 换行
      .replace(new RegExp('"', 'ig'), '\\"') // 双引号
    return `"${val}"`
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
        res: ${mutation} {
          success,
          message
        }
      }`
    })
    return ret.data.data.res
  }
  // 删除数据
  async _del (apiName, _id) {
    const ret = await axios.post(baseurl + '/graphql', {
      query: `mutation {
        res: ${apiName}Remove(_id: ${Gparse(_id)}) {
          success,
          message
        }
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
  // async putIndexSwiper (data) {
  //   return this._put('indexSwiper', data)
  // }
  // 删除首页轮播
  // async delIndexSwiper (data) {
  //   return this._del('indexSwiper', data)
  // }
}

const apiNames = [
  {
    name: 'designer'
  },
  {
    name: 'map'
  },
  {
    name: 'report'
  },
  {
    name: 'indexSwiper',
    exclude: ['get']
  },
  {
    name: 'indexMap',
    exclude: ['get']
  },
  {
    name: 'indexDesigner',
    exclude: ['get']
  }
]

_forEach(apiNames, item => {
  const name = _upperFirst(item.name)
  if (_findIndex(item.exclude, item => item === 'get') === -1) {
    Services.prototype[`get${name}s`] = function (data) {
      return this._getLists(item.name, data)
    }
  }
  if (_findIndex(item.exclude, item => item === 'put') === -1) {
    Services.prototype[`put${name}`] = function (data) {
      return this._put(item.name, data)
    }
  }
  if (_findIndex(item.exclude, item => item === 'del') === -1) {
    Services.prototype[`del${name}`] = function (_id) {
      return this._del(item.name, _id)
    }
  }
})

export default new Services()
