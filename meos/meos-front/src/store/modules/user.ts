// initial state
const state = () => ({
  id: '',
  name: '',
  username: '',
  callsign: '',
  specializations: [],
  belongsToServer: '',
  role: '',
  roleicon: '',
  serverAdmin: false,
  meosAdmin: false,
  GPS: {},
  language: '',
})

// getters
const getters = {
  user: (state) => state,
  id: (state) => state.id,
  name: (state) => state.name,
  username: (state) => state.username,
  belongsToServer: (state) => state.belongsToServer,
  role: (state) => state.role,
  roleicon: (state) => state.roleicon,
  serverAdmin: (state) => state.serverAdmin,
  meosAdmin: (state) => state.meosAdmin,
  callsign: (state) => state.callsign,
  specializations: (state) => state.specializations,
  GPS: (state) => state.GPSid,
  language: (state) => state.language,
}

const mutations = {
  setId(state, id) {
    state.id = id
  },

  setName(state, name) {
    state.name = name
  },

  setUsername(state, username) {
    state.username = username
  },

  setBelongsToServer(state, belongsToServer) {
    state.belongsToServer = belongsToServer
  },

  setRole(state, role) {
    state.role = role
  },

  setRoleIcon(state, roleicon) {
    state.roleicon = roleicon
  },

  setServerAdmin(state, serverAdmin) {
    state.serverAdmin = serverAdmin
  },

  setMeosAdmin(state, meosAdmin) {
    state.meosAdmin = meosAdmin
  },

  setCallsign(state, callsign) {
    state.callsign = callsign
  },

  setSpecializations(state, specializations) {
    state.specializations = specializations
  },

  setGPS(state, GPSid) {
    state.GPSid = GPSid
  },

  setLanguage(state, language) {
    state.language = language
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
