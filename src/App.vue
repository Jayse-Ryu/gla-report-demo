<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style lang="scss">
// Implement multi language font
@import '@/sass/variables.scss';
:lang(ja) {
  .v-application {
    font-family: $body-font-family-ja;
  }
}

html {
  background-color: #212121;
}

#app {
  min-width: 360px;
}

.v-application {
  // Jisu request
  * { letter-spacing: 0 !important; }
}
</style>
