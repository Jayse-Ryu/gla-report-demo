<template>
  <v-card
    id="competencyView"
    elevation="12"
    class="competencyViewCard"
    :class="{
      asideMode: !$vuetify.breakpoint.lgAndDown,
      rtl: $vuetify.rtl,
      ltr: !$vuetify.rtl,
    }"
  >
    <v-btn
      icon
      small
      class="elevation-3"
      style="position: absolute; top: 10px; z-index: 20;"
      :style="{
        right: $vuetify.rtl ? '0' : null,
        left: $vuetify.rtl ? null : '0',
        transform: $vuetify.rtl ? 'translateX(50%)' : 'translateX(-50%)',
        backgroundColor: darkMode ? '#363636' : 'white',
      }"
      :color="darkMode ? 'white' : 'primary'"
      @click="showLocal = !showLocal"
    >
      <v-icon>
        {{ showLocal ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </v-btn>

    <v-navigation-drawer
      :mini-variant="!showLocal"
      floating
      clipped
      width="365"
      :height="!$vuetify.breakpoint.lgAndDown ? null : showLocal ? 350 : 80"
      mini-variant-width="160"
      permanent
      mobile-breakpoint="0"
      style="position: relative;"
    >
      <div
        class="py-4 pl-6 pr-5 subtitle-2 font-weight-bold"
        :class="darkMode ? null : 'primary--text'"
        style="word-break: break-word;"
      >
        {{ $t('interactive.competenciesToView') }}
      </div>
      <transition type="transition">
        <div v-if="report && showLocal">
          <v-card-text
            class="py-1 px-6"
            style="min-height: 200px;"
            :style="{
              maxHeight: !$vuetify.breakpoint.lgAndDown ? '350px' : 'calc(100vh - 430px)',
            }"
          >
            <CompetencyBanners
              :mode="'view'"
              :report="report"
              :data="formattedMapData"
            />
          </v-card-text>
        </div>
      </transition>
    </v-navigation-drawer>

    <div
      v-if="showLocal"
      class="pa-4"
      :class="darkMode ? null : 'primary--text'"
      style="width: 100%; pointer-events: auto;"
      :style="{
        backgroundColor: darkMode ? '#414141' : '#f4f4f4',
      }"
    >
      <div class="subtitle-1">
        {{ $t('interactive.quickNavigation') }}
      </div>

      <div
        v-for="(item, index) in navigationList"
        :key="`quick_${index}`"
        class="py-1"
      >
        <span
          class="px-0 caption customNavigation"
          @click="goToTarget(item.target)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import CompetencyBanners from './components/competencyMap/CompetencyBanners.vue';

export default {
  name: 'CompetenciesToView',

  components: {
    CompetencyBanners,
  },

  mixins: [
    commonDisplay,
    glaStructure,
  ],

  props: {
    report: {
      type: Object,
      default: null,
    },

    formattedMapData: {
      type: Object,
      default: null,
    },
  },

  computed: {
    ...mapState({
      darkMode: (state) => state.displaySettings.darkMode,
      showViewDrawer: (state) => state.interaction.showViewDrawer,
    }),

    showLocal: {
      get() { return this.showViewDrawer; },
      set(newValue) { this.setShowViewDrawer(newValue); },
    },

    navigationList() {
      return [
        { target: '#competencyBrief', name: this.$t('competencyBrief.title') },
        { target: '#competencyMap', name: this.$t('indexes.competencyMap') },
        { target: '#competencyOverview', name: this.$t('indexes.competencyOverview') },
      ];
    },
  },

  methods: {
    ...mapMutations('interaction', [
      'setShowViewDrawer',
      'setSavedToView',
    ]),

    goToTarget(target) {
      this.$vuetify.goTo(target);
    },
  },
};
</script>

<style lang="scss" scoped>
  #competencyView {
    position: fixed;
    top: 100px;
    z-index: 10;
    pointer-events: auto;

    &.asideMode {
      position: sticky;
    }

    &.ltr {
      right: 0;
      left: unset;
    }

    &.rtl {
      right: unset;
      left: 0;
    }

    .customNavigation {
      text-decoration: underline;
      cursor: pointer;
      &:hover { opacity: 0.8; }
      &:active { opacity: 0.6; }
    }
  }
</style>
