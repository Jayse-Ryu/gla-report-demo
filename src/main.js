import Vue from 'vue';
import VueGtag from 'vue-gtag';
import MainCol from '@/views/components/MainCol.vue';
import VueClipboard from 'vue-clipboard2';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import i18n from './i18n';

Vue.config.productionTip = false;
Vue.component('MainCol', MainCol);

Vue.use(
  VueGtag,
  {
    config: { id: process.env.VUE_APP_GA },
  },
  router,
);

Vue.use(VueClipboard);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
