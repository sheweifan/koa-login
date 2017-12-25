import axios from 'axios'
import _map from 'lodash/map'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'
import _compact from 'lodash/compact'

const baseurl = ''
const Gparse = (value) => {
  if (_isArray(value)) {
    return JSON.stringify(value)
  } else if (_isObject(value)) {
    return Gstringify(value)
  } else if (_isNumber(value)) {
    return value
  } else if (_isString(value)) {
    return `"${value.replace(/[\n\r]/g, '<br />')}"`
  } else {
    return null
  }
}
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
  getDesigners ({pageIndex, keys, query}) {
    return axios.get(baseurl + '/graphql', {
      params: {
        query: `{
          designers (pageIndex: ${pageIndex}${query ? ',query:' + query : ''}) {
            totalCount
            list {
              ${keys}
            }
          }
        }`
      }
    })
  }
  getQiniuToken (key) {
    return axios.get(`${baseurl}/qiniu/getToken?key=${key}`)
  }
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
  async putDesigner (data) {
    const mutation = data._id
    ? `mutation {
      designerUpdate(data: ${Gstringify(data)}, _id: ${data._id})
    }`
    : `mutation {
      designerCreate(data: ${Gstringify(data)})
    }`
    const ret = await axios.post(baseurl + '/graphql', {
      query: mutation
    })
    return ret.data.data.designerUpdate || ret.data.data.designerCreate
  }
  async deleteDesigner (_id) {
    const ret = await axios.post(baseurl + '/graphql', {
      query: `mutation {
        designerRemove(_id: ${_id})
      }`
    })
    return ret.data.data.designerRemove
  }
}

export default new Services()
