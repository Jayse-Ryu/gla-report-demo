const state = {
  selectedQuadrant: null,
  highlightedCompetency: null,
  selectedCompetency: null,
  showViewDrawer: false,
  savedToView: [],
};

const mutations = {
  setSelectedQuadrant(state, data) {
    state.selectedQuadrant = data;
    if (data) {
      state.selectedCompetency = null;
    }
  },

  setHighlightedCompetency(state, data) {
    state.highlightedCompetency = data;
  },

  setSelectedCompetency(state, data) {
    state.selectedCompetency = data;
  },

  setShowViewDrawer(state, data) {
    state.showViewDrawer = data;
  },

  setSavedToView(state, data) {
    state.savedToView = data;
  },
};

const actions = {
  changeSelectedQuadrant({ commit, dispatch }, data) {
    commit('setSelectedQuadrant', data);
    dispatch('highlightedCompetencies', data);
  },

  highlightedCompetencies({ commit, state }, competencyMap) {
    const obj = {};

    /**
     * Quadrant index position is
     * 0 1
     * 2 3
     * */
    const range = [
      { key: 0, x: { from: 0, to: 50 }, y: { from: 50, to: 101 } },
      { key: 1, x: { from: 50, to: 101 }, y: { from: 50, to: 101 } },
      { key: 2, x: { from: 0, to: 50 }, y: { from: 0, to: 50 } },
      { key: 3, x: { from: 50, to: 101 }, y: { from: 0, to: 50 } },
    ];

    if (competencyMap && typeof state.selectedQuadrant === 'number') {
      const option = range.find((el) => el.key === state.selectedQuadrant);
      if (option) {
        const map = competencyMap;
        Object.keys(map).forEach((key) => {
          let result;
          if ((map[key].self >= option.x.from && map[key].self < option.x.to)
            && (map[key].all_rater >= option.y.from && map[key].all_rater < option.y.to)) {
            result = map[key];
          }
          if (result) { obj[key] = result; }
        });
      }
    }

    commit('setHighlightedCompetency', obj);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
