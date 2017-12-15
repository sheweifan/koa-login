import * as types from './types'

export default{
  [types.SET_USER] (state, user) {
    state.user = user
  }
}
