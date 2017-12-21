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
}

export default new Services()
