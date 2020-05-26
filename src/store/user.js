import Vue from 'vue'
const state = {
  username: '',
  token: '',
  limit: []
}

const getters = {
  hasLimit: state => limitName => {
    return state.limit.indexOf(limitName) !== -1
  },
  getToken (state) {
    return state
  }
}

const mutations = {
  setUser (state, user) {
    for (let i in user) {
      state[i] = user[i]
    }
  },
  delUser (state) {
    state.username = ''
    state.token = ''
    state.limit = []
  }
}

const actions = {
  login ({ commit, dispatch }, { username, password }) {
    return new Promise((resolve, reject) => {
      commit('delUser')
      Vue.$axios.post('/api/login', {
        loginName: username,
        password: password
      }).then(res => {
        if (res.code === 200) {
          commit('setUser', {
            username: username,
            token: res.token,
            limit: ['DataEntry', 'RoomStatus']
          })
          localStorage.setItem('token', res.token)
          resolve(res)
        } else {
          reject(res.message)
        }
      }).catch(error => {
        reject(error)
        console.log(error)
      })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
