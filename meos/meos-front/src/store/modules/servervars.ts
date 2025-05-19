// initial state
const state = () => ({
  roles: [],
  specializations: [],
  markers: [],
  livemap: false,
  history: [],
  language: 'en'
})

// getters
const getters = {
  all: (state) => state,
  roles: (state) => state.roles,
  specializations: (state) => state.specializations,
  markers: (state) => state.markers,
  livemap: (state) => state.livemap,
  history: (state) => state.history,
  language: (state) => state.language
}

const mutations = {
  setVars(state, vars) {
    state.roles = vars.roles
    state.specializations = vars.specializations
    state.markers = vars.markers
    state.livemap = vars.livemap
    state.history = vars.history
    state.language = vars.language
  },

  setRoles(state, roles) {
    state.roles = roles
  },

  setSpecializations(state, specializations) {
    state.specializations = specializations
  },

  setMarkers(state, markers) {
    state.markers = markers
  },

  setLivemap(state, livemap) {
    state.livemap = livemap
  },

  setHistory(state, history) {
    state.history = history
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
