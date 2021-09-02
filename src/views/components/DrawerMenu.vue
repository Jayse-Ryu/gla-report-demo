<template>
  <v-navigation-drawer
    id="drawerMenu"
    v-model="drawerModel"
    app
    :right="$vuetify.rtl"
    :clipped="$vuetify.breakpoint.mdAndUp"
    :expand-on-hover="expandOnHover"
    :mobile-breakpoint="960"
    width="320"
    :dark="darkMode"
    class="modeDrawer"
    style="height: 100%;"
    :style="{
      paddingBottom: $vuetify.breakpoint.mdAndUp ? '80px' : '10px',
    }"
    :class="{
      'darkDrawer': darkMode,
      'lightDrawer': !darkMode,
      'ltrDrawer': !$vuetify.rtl,
      'rtlDrawer': $vuetify.rtl,
    }"
  >
    <div style="position: relative;">
      <v-list class="pt-5 mb-2">
        <v-list-item>
          <!-- Icon element is necessary to hide logo when clipped -->
          <v-list-item-icon />
          <v-list-item-title
            style="width: 100%;"
            class="d-flex"
            :class="$vuetify.rtl ? 'mr-n9' : 'ml-n9'"
          >
            <!-- Wrapper div for prevent stretching image in flex -->
            <div v-if="$vuetify.breakpoint.mdAndUp">
              <v-img
                v-if="!darkMode"
                src="@/assets/logo.png"
                width="65px"
                alt="GCG Logo"
                contain
                eager
              />
              <v-img
                v-else
                src="@/assets/logo_white.png"
                width="65px"
                alt="GCG Logo"
                contain
                eager
              />
            </div>

            <div v-else>
              <span
                class="font-weight-bold"
                :class="darkMode ? 'white--text' : 'primary--text'"
              >
                {{ $t('common.menu') }}
              </span>
            </div>
            <!-- /Wrapper div -->
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list
        nav
        dense
      >
        <template v-for="(item, key) in menus">
          <!-- Divider -->
          <template v-if="item.text === 'divider'">
            <v-divider
              :key="key"
              class="my-3"
            />
          </template>

          <!-- Group menu -->
          <v-list-group
            v-else-if="item.children"
            :key="key"
            v-model="item.model"
            class="my-3"
            :color="darkMode ? 'grey lighten-4' : 'primary'"
            @click="toggleItem(item)"
          >
            <template #prependIcon>
              <v-icon
                v-if="item.icon.indexOf('assets:') === -1"
                slot="prependIcon"
                size="16px"
              >
                {{ item.icon }}
              </v-icon>
              <v-img
                v-else
                width="18"
                :style="{
                  filter: darkMode ? 'brightness(0) invert(1)' : null,
                  margin: '2px',
                }"
                :src="require(`@/assets/icons/${item.icon.replace('assets:', '')}`)"
                contain
              />
            </template>
            <template #activator>
              <v-list-item-content :disabled="item.disabled">
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>

            <template v-for="(child, i) in item.children">
              <v-list-item
                v-if="child.text === 'comp:banner'"
                :key="`child_comp_${i}`"
              >
                <v-list-item-action />
                <v-list-item-content>
                  <CompetencyBanners
                    v-if="formattedMapData"
                    :mode="'drawer'"
                    :data="formattedMapData"
                    :self-gla="selfGla"
                    :user-plan-type="userPlanType"
                  />
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-else
                :key="`child_item_${i}`"
                link
                exact
                :color="$vuetify.theme.dark ? 'grey lighten-4' : 'primary'"
                @click="toggleItem(child)"
              >
                <v-list-item-action v-if="child.icon">
                  <v-icon
                    v-if="child.icon !== 'blank'"
                    size="20px"
                  >
                    {{ child.icon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title
                    class="ml-1"
                  >
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-group>

          <!-- Single menu -->
          <v-list-item
            v-else
            :key="item.text"
            :to="item.to"
            link
            :disabled="item.disabled"
            class="my-3"
            :color="darkMode ? 'grey lighten-4' : 'primary'"
          >
            <!--
              :exact="item.to.name === 'hybridDashboard'"
              example: leader should be active when leader/:id
              but dashboard should not be active when oon any page
            -->
            <v-list-item-action>
              <v-icon
                v-if="item.icon.indexOf('assets:') === -1"
                size="16px"
              >
                {{ item.icon }}
              </v-icon>
              <v-img
                v-else
                width="18"
                :style="{
                  filter: darkMode ? 'brightness(0) invert(1)' : null,
                  margin: '2px',
                }"
                :src="require(`@/assets/icons/${item.icon.replace('assets:', '')}`)"
                contain
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <div
          v-if="$vuetify.breakpoint.smAndDown"
          id="drawerMobileFooter"
        >
          <v-row class="mt-8 px-2 pb-1">
            <v-col cols="12">
              <v-select
                v-model="darkModeLocal"
                dense
                hide-details
                rounded
                outlined
                :label="$t('interactive.theme')"
                class="caption"
                :style="{
                  maxWidth: $vuetify.breakpoint.smAndDown ? null : '240px',
                }"
                :items="themeList"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-if="languages.length"
                v-model="currentLanguage"
                dense
                hide-details
                rounded
                outlined
                :style="{
                  maxWidth: $vuetify.breakpoint.smAndDown ? null : '240px',
                }"
                :label="$t('common.language')"
                class="caption"
                :items="languages"
                item-text="value"
                item-value="key"
              />
            </v-col>

            <v-col cols="12">
              <v-btn
                text
                height="25"
                small
                :color="darkMode ? null : 'primary'"
                class="text-decoration-underline"
                style="text-transform: capitalize; font-weight: 500;"
                :loading="loadingPdf"
                @click="downloadDialog = true"
              >
                {{ $t('interactive.download_pdf') }}
              </v-btn>
            </v-col>

            <v-col
              v-if="!isPublic"
              cols="12"
            >
              <v-btn
                text
                height="25"
                small
                :color="darkMode ? null : 'primary'"
                class="text-decoration-underline"
                style="text-transform: capitalize; font-weight: 500;"
                @click="shareDialog = true"
              >
                {{ $t('interactive.share') }}
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Privacy policy inside of list -->
        <v-list-item class="pt-10">
          <v-list-item-icon
            class="ma-0 pa-0"
            style="width: 0; height: 0;"
          />
          <v-list-item-title
            class="px-0"
            :class="$vuetify.rtl ? 'mr-n11' : 'ml-n11'"
          >
            <v-btn
              text
              small
              class="text-decoration-underline text--disabled"
              style="font-weight: 500;"
              @click="goToPolicy"
            >
              {{ $t('common.privacyPolicy') }}
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <ShareDialog
      :show.sync="shareDialog"
      :self-gla="selfGla"
      :report="report"
    />

    <DownloadDialog
      v-if="$vuetify.breakpoint.smAndDown"
      :show.sync="downloadDialog"
      :self-gla="selfGla"
      :report="report"
      :languages="languages"
      :public-password="publicPassword"
      @changeLoadingPdf="changeLoadingPdf"
    />
  </v-navigation-drawer>
</template>

<script>
import { mapMutations } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import CompetencyBanners from '../gla/content/reportOverview/widget/components/competencyMap/CompetencyBanners.vue';
import ShareDialog from './ShareDialog.vue';
import DownloadDialog from './DownloadDialog.vue';

export default {
  name: 'DrawerMenu',

  components: {
    CompetencyBanners,
    ShareDialog,
    DownloadDialog,
  },

  mixins: [
    commonDisplay,
    glaStructure,
  ],

  props: {
    // menus: [{ text: 'Display', icon: 'Material', to: { name: 'Router name' } }],
    menus: {
      type: Array,
      default: null,
    },

    report: {
      type: Object,
      default: null,
    },

    formattedMapData: {
      type: Object,
      default: null,
    },

    selfGla: {
      type: Boolean,
      default: false,
    },

    languages: {
      type: Array,
      default: () => [],
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    publicPassword: {
      type: String,
      default: '',
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  data: () => ({
    downloadDialog: false,
    shareDialog: false,
    loadingPdf: false,
  }),

  computed: {
    drawerModel: {
      get() {
        // Always display drawer when large screen
        if (this.$vuetify.breakpoint.mdAndUp) {
          return true;
        }
        return this.$store.state.displaySettings.showDrawer;
      },
      set(value) {
        if (this.$store.state.displaySettings.showDrawer === !value) {
          this.toggleShowDrawer();
        }
      },
    },

    expandOnHover: {
      get() {
        // Always show full drawer when on mobile
        if (!this.$vuetify.breakpoint.mdAndUp) {
          return false;
        }
        return this.$store.state.displaySettings.expandDrawerOnHover;
      },
      set(value) {
        if (this.$store.state.displaySettings.expandDrawerOnHover === !value) {
          this.toggleExpandDrawerOnHover();
        }
      },
    },

    competencyData() {
      let data = null;
      if (this.report?.competency_map) {
        data = this.report.competency_map;
      }
      return data;
    },
  },

  methods: {
    ...mapMutations('displaySettings', [
      'toggleExpandDrawerOnHover',
      'toggleShowDrawer',
    ]),

    toggleItem(item) {
      if (item?.to?.name && this.$route.name !== item.to.name) {
        this.$router.push(item.to);
        if (item.scroll) {
          this.mixScrollToItem(`#${item.scroll}`, true);
        }
      } else if (item.scroll) {
        this.mixScrollToItem(`#${item.scroll}`);
      }
    },

    goToPolicy() {
      const url = 'https://globalcoachgroup.com/privacy-policy/';
      window.open(url, '_blank');
    },

    changeLoadingPdf(newValue) {
      this.loadingPdf = newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
  .modeDrawer {
    &:not(.v-navigation-drawer--is-mobile) {
      &.darkDrawer {
        background: rgb(0, 42, 76);
      }
      &.lightDrawer {
        background: rgba(255, 255, 255, 0.8);
      }
    }

    &.v-navigation-drawer--is-mobile {
      &.darkDrawer {
        background: rgb(0, 42, 76);
      }
      &.lightDrawer {
        background: rgba(255, 255, 255, 0.9);
      }
    }
  }
</style>

<style lang="scss">
  #drawerMenu {
    .v-navigation-drawer__border {
      width: 2px;
    }

    &.darkDrawer {
      background: rgb(0, 42, 76);
      .v-navigation-drawer__border {
        background-color: transparent;
      }
    }

    &.ltrDrawer {
      .v-list-item__action:first-child, .v-list-item__icon:first-child {
        margin-right: 14px !important;
      }
    }

    &.rtlDrawer {
      .v-list-item__action:first-child, .v-list-item__icon:first-child {
        margin-left: 14px !important;
      }
    }
  }
</style>
