<template>
  <div
    id="glaReportMain"
    :class="darkMode ? 'darkReport' : 'lightReport'"
    :style="{
      color: darkMode ? 'white' : null,
    }"
  >
    <DrawerMenu
      :menus="menus"
      :report="reportData"
      :formatted-map-data="formattedMapData"
      :self-gla="selfGla"
      :languages="languages"
      :is-public="!!publicReportData"
      :public-password="publicPassword"
      :user-plan-type="userPlanType"
    />

    <v-main
      :class="$vuetify.breakpoint.smAndDown ? 'px-0' : null"
    >
      <TopBar
        v-if="$vuetify.breakpoint.smAndDown"
      />

      <v-container
        :class="[
          !$vuetify.breakpoint.lgAndUp ? 'pt-16 mt-2' : 'pt-10',
          $vuetify.breakpoint.smAndDown ? 'px-0' : null,
        ]"
        style="margin-bottom: 90px;"
        fluid
      >
        <!--
          Set maxWidth < ('MainCol maxWidth' + Smallest content maxWidth(1000))
          to not break the layout in very wide screen
        -->
        <v-row
          align="center"
          justify="center"
          class="mx-auto"
          style="max-width: 2395px;"
        >
          <InnerHeader :report="reportData" />
          <v-fade-transition mode="out-in">
            <router-view
              :key="routeKey"
              :self-gla="selfGla"
              :report="reportData"
              :formatted-map-data="formattedMapData"
              :user-plan-type="userPlanType"
            />
          </v-fade-transition>
        </v-row>
      </v-container>
    </v-main>

    <Footer
      v-if="$vuetify.breakpoint.mdAndUp"
      :self-gla="selfGla"
      :is-public="!!publicReportData"
      :public-password="publicPassword"
      :report="reportData"
      :languages="languages"
    />

    <v-overlay
      :value="loading"
      :z-index="20"
    >
      <v-progress-linear
        height="25"
        style="width: 50vw;"
        color="#003865"
        rounded
        indeterminate
      />
    </v-overlay>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import glaApi from '@/api/gla/report';
import TopBar from '../components/TopBar.vue';
import DrawerMenu from '../components/DrawerMenu.vue';
import InnerHeader from './content/common/InnerHeader.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'GlaMain',

  components: {
    TopBar,
    DrawerMenu,
    InnerHeader,
    Footer,
  },

  mixins: [
    commonDisplay,
  ],

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },

    publicReportData: {
      type: Object,
      default: null,
    },

    publicPassword: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    highLowGroups: ['manager', 'direct_report', 'peer', 'other', 'all_rater'],
    significantGapGroups: [
      'self_vs_manager',
      'self_vs_direct_report',
      'self_vs_peer',
      'self_vs_other',
      'self_vs_all_rater',
    ],
    loading: false,
    mounted: false,
    reportData: null,
    languages: [],
    selectedPlan: null,
    slaPlans: [
      { text: 'Free', value: 'free' },
      { text: 'Focused', value: 'focused' },
      { text: 'Full', value: 'full' },
    ],
  }),

  computed: {
    ...mapState({
      user: (state) => state.account.user,
    }),

    routeKey() {
      return `${this.$route.name}${this.$route.params.id ? this.$route.params.id : ''}`;
    },

    menus() {
      const data = [];
      let prefix = '';

      if (this.selfGla) {
        prefix = this.publicReportData ? 'publicSla' : 'sla';
      } else {
        prefix = this.publicReportData ? 'publicGla' : 'gla';
      }

      // Report overview
      const overview = {
        text: this.$t('indexes.reportOverview'),
        icon: 'assets:main.svg',
        to: { name: `${prefix}Overview` },
        model: false,
        children: [],
      };
      // Push overview children
      if (this.hasCompetencyPercentiles) {
        overview.children.push({
          text: this.$t('indexes.competencyPercentiles'),
          icon: 'mdi-circle-small',
          to: { name: `${prefix}Overview` },
          scroll: 'competencyBrief',
        });
      }
      if (this.hasCompetencyBrief) {
        overview.children.push({
          text: this.$t('indexes.competencyBrief'),
          icon: 'mdi-circle-small',
          to: { name: `${prefix}Overview` },
          scroll: 'competencyBrief',
        });
      }
      if (this.hasCompetencyMap) {
        overview.children.push({
          text: this.$t('indexes.competencyMap'),
          icon: 'mdi-circle-small',
          to: { name: `${prefix}Overview` },
          scroll: 'competencyMap',
        });
      }
      if (this.hasCompetencyOverview) {
        overview.children.push({
          text: this.$t('indexes.competencyOverview'),
          icon: 'mdi-circle-small',
          to: { name: `${prefix}Overview` },
          scroll: 'competencyOverview',
        });
      }
      if (overview.children && overview.children.length) { data.push(overview); }
      // /Report overview

      if (this.hasHigh) {
        data.push({
          text: this.$t('indexes.highestRatedItems'),
          icon: 'assets:highest.svg',
          to: { name: `${prefix}High` },
        });
      }
      if (this.hasLow) {
        data.push({
          text: this.$t('indexes.lowestRatedItems'),
          icon: 'assets:lowest.svg',
          to: { name: `${prefix}Low` },
        });
      }
      if (this.hasSignificantGaps) {
        data.push({
          text: this.$t('indexes.significantGaps'),
          icon: 'assets:gaps.svg',
          to: { name: `${prefix}SignificantGap` },
        });
      }
      if (this.hasVerbatim) {
        data.push({
          text: this.$t('indexes.writtenComments'),
          icon: 'assets:comments.svg',
          to: { name: `${prefix}Comments` },
        });
      }
      if (this.hasOverview) {
        data.push({ text: 'divider' });
        data.push({
          text: this.$t('indexes.respondentsOverview'),
          icon: 'assets:overview.svg',
          to: { name: `${prefix}RespondentsOverview` },
        });
      }
      if (this.hasCompetencyOverview && this.$vuetify.breakpoint.mdAndUp) {
        data.push({
          text: this.$t('indexes.listOfCompetencies'),
          icon: 'assets:list.svg',
          model: false,
          children: [
            { text: 'comp:banner' },
          ],
        });
      }

      return data;
    },

    /**
     * Base information
     */
    userPlanType() {
      let plan = 'free';
      if (this.reportData?.gla_user?.plan_type) { plan = this.reportData.gla_user.plan_type; }
      if (plan === 'full' && !this.user.is_staff) { plan = 'focused'; }
      return plan;
    },

    /**
     * Section flag
     */
    hasCompetencyPercentiles() {
      // Hide for Free, Focused, Full but normal user
      return (this.reportData
        && (!this.selfGla || (!['free', 'focused'].includes(this.userPlanType) && this.user.is_staff)));
    },

    hasCompetencyBrief() {
      return this.reportData?.competency_brief;
    },

    hasCompetencyMap() {
      return this.reportData?.competency_map;
    },

    hasCompetencyOverview() {
      return this.reportData && this.userPlanType !== 'free';
    },

    hasHigh() {
      if (this.reportData?.high_low_data && this.userPlanType !== 'free') {
        const hlData = { ...this.reportData.high_low_data };
        delete hlData.self;

        return Object.values(hlData).some((el) => (el.top && el.top.length > 0));
      }
      return false;
    },

    hasLow() {
      if (this.reportData?.high_low_data && this.userPlanType !== 'free') {
        const hlData = { ...this.reportData.high_low_data };
        delete hlData.self;

        return Object.values(hlData).some((el) => (el.bottom && el.bottom.length > 0));
      }
      return false;
    },

    hasSignificantGaps() {
      if (this.reportData && this.userPlanType !== 'free') {
        return Object.keys(this.reportData).some((el) => this.significantGapGroups.includes(el));
      }
      return false;
    },

    hasVerbatim() {
      if (this.reportData?.verbatim && Object.keys(this.reportData.verbatim).length > 0
        && this.userPlanType !== 'free') {
        return Object.values(this.reportData.verbatim).some(
          (el) => Object.values(el).some(
            (el2) => el2.some((el3) => el3.edited_answer || (!el3.edited_answer && el3.answer)),
          ),
        );
      }
      return false;
    },

    hasOverview() {
      return this.reportData?.overview;
    },

    hasCompetencyDescription() {
      return this.userPlanType === 'free';
    },

    hasCta() {
      if (this.reportData?.gla_user?.plan_type) {
        return ['free', 'focused'].includes(this.reportData.gla_user.plan_type);
      }
      return false;
    },

    formattedMapData() {
      let data = null;

      if (this.reportData?.competency_map) {
        const mapData = this.reportData.competency_map;
        data = {
          assure_success: [],
          continuous_change: [],
          engaging_people: [],
          boundaryless_inclusion: [],
          communication: [],
        };

        Object.entries(mapData).forEach(([comp, item]) => {
          data[item.cluster].push({
            all_rater: item.all_rater,
            self: item.self,
            competency: comp,
            number: item.number,
          });
          data[item.cluster] = data[item.cluster]
            .sort((a, b) => a.number - b.number);
        });
      }

      return data;
    },
  },

  async created() {
    this.getLanguages();
    if (!this.publicReportData) {
      await this.getCurrentUser();
      this.getReportData();
    } else {
      this.reportData = this.publicReportData;
    }
  },

  methods: {
    ...mapActions('account', [
      'getCurrentUser',
    ]),

    async getLanguages() {
      try {
        this.languages = await glaApi.getLanguage(this.selfGla);
      } catch (err) {
        console.log(err);
      }
    },

    async getReportData(option) {
      try {
        this.loading = true;
        const params = {};
        if (option === 'plan') {
          params.version = this.selectedPlan;
        }
        if (this.user.is_staff) {
          const response = await glaApi
            .getReportAdmin(this.$route.params.id, this.selfGla, params);
          if (option === 'plan') {
            response.gla_user.plan_type = this.selectedPlan;
          }
          this.reportData = response;
        } else {
          this.reportData = await glaApi.getReport(this.$route.params.id, this.selfGla);
        }
        this.selectedPlan = null;
      } catch (err) {
        console.log(err);
        this.$router.push({ name: '404' });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  #glaReportMain {
    min-height: 100vh;

    &.darkReport {
      background-color: #003865;
    }
  }
</style>
