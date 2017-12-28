import axios from 'axios'
import Services from './services'
import * as types from './types'

export default {
  nuxtServerInit ({commit}, {req}) {
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
  async getQiniuToken ({ commit }, key) {
    return Services.getQiniuToken(key)
  },
  async getTypes ({ commit }) {
    const {data} = await Services.getTypes()
    commit(types.SET_TYPES, data.data)
  },
  // 设计师
  async getDesigner ({ commit }, query) {
    return Services.getDesigners(query)
  },
  async putDesigner ({ commit }, data) {
    return Services.putDesigner(data)
  },
  async delDesigner ({ commit }, _id) {
    return Services.delDesigner(_id)
  },
  // 效果图
  async getMap ({ commit }, query) {
    return Services.getMaps(query)
  },
  async putMap ({ commit }, data) {
    return Services.putMap(data)
  },
  async delMap ({ commit }, _id) {
    return Services.delMap(_id)
  }
}
