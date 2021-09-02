import { mapState, mapMutations } from 'vuex';
import { selectLocaleAsync } from '@/i18n';

export default {
  computed: {
    ...mapState({
      darkMode: (state) => state.displaySettings.darkMode,
    }),

    darkModeLocal: {
      get() {
        return this.darkMode;
      },
      set(newValue) {
        this.setDarkMode(newValue);
      },
    },

    themeList() {
      return [
        { value: false, text: this.$t('interactive.light_mode') },
        { value: true, text: this.$t('interactive.dark_mode') },
      ];
    },

    currentLanguage: {
      get() {
        if (this.languages.length > 0
          && this.languages.find((el) => el.key === this.$i18n.locale)) {
          return this.languages.find((el) => el.key === this.$i18n.locale);
        }
        return { key: 'en', name_local: 'English', value: 'English' };
      },
      async set(lang) {
        await selectLocaleAsync(lang);
      },
    },
  },

  watch: {
    darkMode: {
      immediate: true,
      handler(newValue) {
        this.$vuetify.theme.dark = newValue;
      },
    },
  },

  methods: {
    ...mapMutations('displaySettings', [
      'setDarkMode',
    ]),

    mixScrollToItem(id, delay) {
      const scrollOption = {
        duration: 500,
        offset: 0,
        easing: 'easeInOutCubic',
      };

      const wait = delay ? 800 : 0;
      setTimeout(() => {
        this.$vuetify.goTo(id, scrollOption);
      }, wait);
    },
  },
};
