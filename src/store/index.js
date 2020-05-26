import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import community from './community'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    community
  }
})
