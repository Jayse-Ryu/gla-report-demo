<template>
  <v-app-bar
    id="topBarTool"
    dense
    fixed
    :color="darkMode ? 'rgba(0, 56, 101, 0.3)' : 'rgba(255, 255, 255, 0.3)'"
  >
    <v-btn
      class="pa-0 elevation-0"
      color="transparent"
      tile
      min-width="36"
      @click.stop="clickNavIcon"
    >
      <v-icon
        :color="darkMode ? 'white' : null"
      >
        mdi-menu
      </v-icon>
    </v-btn>

    <v-spacer />

    <div
      class="pa-2"
      style="cursor: pointer;"
      @click="openLink"
    >
      <v-img
        v-if="!darkMode"
        src="@/assets/logo.png"
        width="50px"
        alt="GCG Logo"
        contain
        eager
      />
      <v-img
        v-else
        src="@/assets/logo_white.png"
        width="50px"
        alt="GCG Logo"
        contain
        eager
      />
    </div>
  </v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';

export default {
  name: 'TopBar',

  mixins: [commonDisplay],

  methods: {
    ...mapMutations('displaySettings', [
      'toggleExpandDrawerOnHover',
      'toggleShowDrawer',
    ]),

    clickNavIcon() {
      this.toggleShowDrawer();
    },

    openLink() {
      window.open('http://globalcoachgroup.com/', '_blank');
    },
  },
};
</script>

<style lang="scss">
  #topBarTool {
    .v-toolbar__content {
      padding-right: 8px;
      padding-left: 8px;
    }
  }
</style>
