import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import displaySettings from './modules/displaySettings';
import interaction from './modules/interaction';
import account from './modules/account';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: process.env.VUE_APP_VUEX_KEY,
  modules: [
    'account',
    'displaySettings',
    'interaction',
  ],
});

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    displaySettings,
    interaction,
    account,
  },
  strict: debug,
  plugins: [vuexLocal.plugin],
});
