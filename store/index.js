import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const createStore = () => {
  return new Vuex.Store({
    state: {
      imgPrefix: 'http://p0vl9fdf5.bkt.clouddn.com/',
      user: null
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
