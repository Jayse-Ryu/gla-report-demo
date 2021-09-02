const state = {
  darkMode: false,
  itemsPerPage: 10,
  expandDrawerOnHover: true,
  showDrawer: false,
};

// getters
const getters = {
  getItemsPerPage: (state) => (state.itemsPerPage),
};

// mutations
const mutations = {
  toggleDarkMode(state) {
    state.darkMode = !state.darkMode;
  },

  setDarkMode(state, newValue) {
    state.darkMode = newValue;
  },

  updateItemsPerPage(state, newItemsPerPage) {
    if ([-1, 5, 10, 15, 50, 100, 200].includes(newItemsPerPage)) {
      state.itemsPerPage = newItemsPerPage;
    }
  },

  toggleShowDrawer(state) {
    state.showDrawer = !state.showDrawer;
  },

  toggleExpandDrawerOnHover(state) {
    state.expandDrawerOnHover = !state.expandDrawerOnHover;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
