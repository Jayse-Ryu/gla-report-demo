export default function loadLangFont(lang) {
  if (!['ja'].includes(lang)) return;

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  switch (lang) {
    case 'ja':
      fontLink.href = 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@100;300;400;500;700;800;900&family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap';
      break;
    default:
  }

  document.getElementsByTagName('head')[0].appendChild(fontLink);
}
