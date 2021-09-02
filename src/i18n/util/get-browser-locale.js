export default function getBrowserLocale() {
  const navigatorLocale = navigator.languages !== undefined
    ? navigator.languages[0]
    : navigator.language;
  if (!navigatorLocale) {
    return undefined;
  }
  const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0];
  return trimmedLocale;
}
