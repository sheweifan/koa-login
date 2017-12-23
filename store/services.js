import axios from 'axios'
import _map from 'lodash/map'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'

const baseurl = ''
const GparseObject = (value) => {
  if (_isArray(value)) {
    return JSON.stringify(value)
  } else if (_isObject(value)) {
    return Gstringify(value)
  } else if (_isNumber(value)) {
    return value
  } else if (_isString(value)) {
    return `"${value}"`
  }
}
const Gstringify = (data) => {
  return `{
    ${_map(data, (value, key) => `${key}: ${GparseObject(value)}`).join('\n')}
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
  putDesigner (data) {
    const mutation = data._id
    ? `mutation {
      designerUpdate(data: ${Gstringify(data)}, _id: ${data._id})
    }`
    : `mutation {
      designerCreate(data: ${Gstringify(data)})
    }`
    return axios.post(baseurl + '/graphql', {
      query: mutation
    })
  }
}

export default new Services()
