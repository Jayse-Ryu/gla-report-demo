import getBrowserLocale from './get-browser-locale';
import supportedLocales from '../config/supported-locales';

/**
 * Define default language by checking:
 * 1. current Url contains param ?lang=locale
 * 2. locale Storage has locale
 * 3. user browser language
 * 4. default language (english)
 */
export default function getStartingLocale() {
  // console.log(supportedLocales);

  // Check URL
  const urlLocale = new URLSearchParams(window.location.search).get('lang');
  if (urlLocale && supportedLocales.some((lang) => lang.code === urlLocale)) {
    return urlLocale;
  }

  // Check browser language
  const browserLocale = getBrowserLocale();
  // console.log('browserLocale', browserLocale);
  if (supportedLocales.some((lang) => lang.code === browserLocale)) {
    return browserLocale;
  }

  // Return default app language
  return process.env.VUE_APP_I18N_LOCALE || 'en';
}
