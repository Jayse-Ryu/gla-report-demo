import glaApi from '@/api/gla/report';

const state = {
  user: {},
};

// getters
const getters = {
  isStaff: (state) => (!!state.user.is_staff),
  isSuperUser: (state) => (!!state.user.is_superuser),
};

// mutations
const mutations = {
  setUser(state, data) {
    state.user = data;
  },

  clearUser(state) {
    state.user = {};
  },
};

// actions
const actions = {
  async getCurrentUser({ commit }) {
    // empty user data
    commit('clearUser');

    try {
      const response = await glaApi.currentUser();
      commit('setUser', response);

      return response;
    } catch (err) {
      return null;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
