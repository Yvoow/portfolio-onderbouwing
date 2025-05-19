import { playSound } from "@/utils/playSound";
const state = () => ([]);

const getters = {
  all: (state) => state,
}

const actions = {
  show({ commit }, { message, type }) {
    const newNotification = {
      enabled: true,
      message,
      type,
      id: Math.random().toString(36).substr(2, 9),
    };
    commit('addNotification', newNotification);
    playSound(type);

    setTimeout(() => {
      commit('removeNotification', newNotification.id);
    }, 3000);
  },

  hide({ commit }, id) {
    commit('removeNotification', id);
  }
}

const mutations = {
  addNotification(state, notification) {
    state.push(notification);
  },

  removeNotification(state, id) {
    const index = state.findIndex((notif) => notif.id === id);
    if (index !== -1) {
      state.splice(index, 1);
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
