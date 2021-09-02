import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';
import VuetifyToast from 'vuetify-toast-snackbar';

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon,
  },
});

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: {
          base: '#003865',
          darken1: '#010f27',
          lighten1: '#4e7ca8',
          lighten2: '#29abe2',
          lighten3: '#c7d2df',
          lighten4: '#ecf1f8',
          lighten5: '#f4f9ff',
        },
        secondary: {
          base: '#366ACF',
          lighten1: '#29ABE2',
        },
        tertiary: {
          base: '#A1A1A1',
          lighten1: '#C4C4C4',
          lighten2: '#F1F1F1',
          lighten3: '#F9F9F9',
        },
        success: '#80CE4D',
        warning: '#F19C38',
        error: '#FF0000',
        info: '#29ABE2',
      },
      dark: {
        primary: {
          base: '#4e7ca8',
          darken1: '#010f27',
          lighten1: '#4e7ca8',
          lighten2: '#29abe2',
          lighten3: '#c7d2df',
          lighten4: '#ecf1f8',
          lighten5: '#f4f9ff',
        },
        secondary: {
          base: '#366ACF',
          lighten1: '#29ABE2',
        },
        tertiary: {
          base: '#A1A1A1',
          lighten1: '#C4C4C4',
          lighten2: '#F1F1F1',
          lighten3: '#F9F9F9',
        },
        success: '#80CE4D',
        warning: '#F19C38',
        error: '#FF0000',
        info: '#29ABE2',
      },
    },
  },
});

Vue.use(VuetifyToast, {
  $vuetify: vuetify.framework,
  x: 'left',
});

export default vuetify;
