import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      authUser: null
    }
  },

  actions: {
    SET_AUTH_USER (store, payload) {
      // console.log(payload)
      store.commit('SET_AUTH_USER', payload)
    },
    UNSET_SET_AUTH_USER (store) {
      return store.commit('UNSET_SET_AUTH_USER')
    }
  },

  mutations: {
    SET_AUTH_USER (state, payload) {
      state.user.loggedIn = true
      state.user.authUser = payload
    },

    UNSET_SET_AUTH_USER (state) {
      state.user.loggedIn = false
      state.user.authUser = null
    }
  },

  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production'
})
