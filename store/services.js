import axios from 'axios'

const baseurl = ''

class Services {
  getDesigners ({pageIndex, keys, query}) {
    console.log(pageIndex, keys, query)
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
}

export default new Services()
