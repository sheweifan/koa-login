import axios from 'axios'

const baseurl = ''

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
}

export default new Services()
