# GLA web report Demo
This project is based on the Global Coach Group's Global Leadership Assessment service.
> Demo site : https://jayse-ryu.github.io/gla-report-demo/

## Features
- Clickable highlight competency
- Competency bookmark with drag and drop
- Competency summary result
- Share the report as public
- Generate report as PDF
- Fully responsive layout
- Translation without reloading page (include RTL)
- Theme light and dark

## Project structures
- [`src`](#src)
  - [`api`](#api)
  - [`assets`](#assets)
  - [`i18n`](#i18n)
  - [`mixins`](#mixins)
  - [`plugins`](#plugins)
  - [`router`](#router)
  - [`sass`](#sass)
  - [`store`](#store)
  - [`views`](#views)

### src
Source directory.

### api
API lists by end point
- `interceptors` Global API error catcher

### assets
Brand logo / Icons / How to read images.

### i18n
Internationalization and localization.
Setup in index.js, translate key is in locales directory.

### mixins
The duplicated functions for more than two components.
- `apiRules` Backend error key handler from api interceptor
- `commonDisplay` Theme and selected language
- `dialog` working with v-dialog(vuetify)
- `glaStructure` GLA survey structure to display chart
- `howToDialog` How to read dialog options
- `urlHandler` Managing PDF download and generate

### plugins
Vue-cli 3 installed package.
- `vuetify` https://vuetifyjs.com/en/

### router
Router list for client.
- `generateGlaChildren` Duplicated child router for GLA, SLA.

### sass
- `variables.scss` A overwrite style feature of vuetify. https://vuetifyjs.com/en/features/sass-variables/

### store
Vuex local storage module
- `account` Logged in user information to authorize.
- `displaySettings` Common component saved options.
- `interaction` Interactive report feature options.

## views
View components
- `components` Common components
  - `DownloadDialog.vue`
  - `DrawerMenu.vue`
  - `Footer.vye`
  - `MainCol.vue` Modified container uses as `<MainCol>`
  - `ShareDialog.vue`
  - `TopBar.vue`
- `gla` GLA report components
  - `GLAMain.vue` Report
  - `PublicGLA.vue` Publicly shared report
  - `common` Common components and design particles
    - `InnerHeader.vue` Report Title header
    - `HowToRead.vue` How to read component
    - `ArrowDown.vue` Arrow down for PDF and Web
    - `ArrowHigh.vue` Arrow up for PDF and Web
    - `CircleColor.vue` Coloured circle for PDF and Web
    - `HighLowDot.vue` Dot mark for PDF and Web
    - `PercentageBackground.vue` Competency summary matrix circle percentage
  - `password` Input password to see public shared report
  - `reportOverview` Report main page
  - `respondentsOverview` Respondents result page
  - `significantGap` Significant gap page
  - `writtenComments` Verbatim section page

## Setup for development
```
# Install dependencies
npm install

# Serve with hot reload at localhost:3014
npm run serve
```
> You need `//registry.npmjs.org/:_authToken=<token>` in .npmrc to get `@gc_group/gla-survey-locales` and `Highcharts` license for prod
