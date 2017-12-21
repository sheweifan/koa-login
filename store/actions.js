import axios from 'axios'
import Services from './services'
import * as types from './types'

export default {
  nuxtServerInit ({commit}, {req}) {
    // console.log(req.session)
    if (req.session && req.session.user) {
      const { email, role, _id } = req.session.user

      commit(types.SET_USER, { email, role, _id })
    }
  },
  async login ({ commit }, { email, password }) {
    try {
      let res = await axios.post('/admin/login', {
        email, password
      })

      const { data, success } = res.data

      if (success) {
        commit(types.SET_USER, data)
      }

      return res.data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('...')
      }
    }
  },
  async logout ({commit}) {
    await axios.post('/admin/logout')
    commit(types.SET_USER, null)
  },
  async getDesigner ({ commit }, query) {
    return Services.getDesigners(query)
  },
  async getQiniuToken ({ commit }, key) {
    return Services.getQiniuToken(key)
  }
}
