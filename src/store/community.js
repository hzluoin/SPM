import Vue from 'vue'
const state = {
  community: []
}

const getters = {
  getCommunity (state) {
    return state.community
  }
}

const mutations = {
  setCommunity (state, community) {
    state.community = community
  }
}

const actions = {
  qryAllCommunity ({ getters, commit }) {
    return new Promise((resolve, reject) => {
      Vue.$axios.post('/api/communityInfo/infoQueryAll', {}).then(res => {
        // commit('setCommunity', res.data.rows.map(item => {
        //   item['text'] = item['communityName']
        //   return item
        // }))
        commit('setCommunity', res.data.rows)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateCommunity ({ getters, commit }, community) {
    return new Promise((resolve, reject) => {
      Vue.$axios.post('/api/communityInfo/edit', community).then(res => {
        resolve()
      }).catch(err => {
        reject(err)
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
