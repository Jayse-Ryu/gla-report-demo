import Vue from 'vue';
import VueI18n from 'vue-i18n';
import getStartingLocale from "@/i18n/util/get-starting-locale";
import loadLangFont from "@/i18n/util/load-lang-font";
import Vuetify from '@/plugins/vuetify';

// Official vue i18n is bad,
// follow https://phrase.com/blog/posts/ultimate-guide-to-vue-localization-with-vue-i18n/

Vue.use(VueI18n);

const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';

const i18n = new VueI18n({
  fallbackLocale,
  messages: {},
});

const loadedLanguages = [];

export async function loadLocaleMessagesAsync(locale) {
  const [messages, surveyMessages] = await Promise.all([
    import(/* webpackChunkName: "locale-[request]" */ `@/i18n/locales/${locale}.json`),
    import(/* webpackChunkName: "locale-survey-[request]" */ `@gc_group/gla-survey-locales/${locale}.json`),
  ]);

  i18n.setLocaleMessage(locale, {
    ...messages.default,
    ...surveyMessages.default,
  });
  loadedLanguages.push(locale);
  return locale;
}

export async function selectLocaleAsync(locale) {
  console.log('selectLocaleAsync', locale);
  document.documentElement.lang = locale;

  Vuetify.framework.rtl = (locale === 'ar');

  if (loadedLanguages.length > 0 && i18n.locale === locale) {
    return locale;
  }

  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    i18n.locale = locale;
    return locale;
  }

  loadLangFont(locale);

  await loadLocaleMessagesAsync(locale);

  i18n.locale = locale;

  // this code need to be repeated, or rtl will not be set correctly on first page loading
  Vuetify.framework.rtl = (locale === 'ar');

  return locale;
}

const locale = getStartingLocale();
selectLocaleAsync(locale);

//  Load fallback if different than starting locale
if (locale !== fallbackLocale) {
  loadLocaleMessagesAsync(fallbackLocale);
}

export default i18n;
