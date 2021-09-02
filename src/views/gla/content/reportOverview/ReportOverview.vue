<template>
  <MainCol style="position: relative;">
    <div>
      <div class="mb-10">
        <div
          id="competencyBrief"
          class="body-1 font-weight-bold pb-2 mb-8"
          :class="darkMode ? null : 'primary--text'"
          style="border-bottom: 1px solid;"
          :style="{
            borderColor: darkMode ? 'white' : '#003865',
          }"
        >
          <div class="d-flex justify-space-between align-end">
            {{ $t('competencyBrief.title') }}

            <v-btn
              class="px-1"
              text
              small
              @click="mixToggleHowTo(['percentileRadar'])"
            >
              {{ $t('interactive.howToRead') }}
              <v-icon
                class="px-1"
                size="15"
              >
                mdi-alert-circle-outline
              </v-icon>
            </v-btn>
          </div>
        </div>

        <v-row v-if="report">
          <v-col
            v-if="!['free', 'focused'].includes(userPlanType)"
            cols="12"
            lg="6"
          >
            <CompetencyPercentileRadar :report="report" />
          </v-col>
          <v-col
            cols="12"
            :lg="['free', 'focused'].includes(userPlanType) ? 9 : 6"
          >
            <CompetencyBrief :report="report" />
          </v-col>
        </v-row>
      </div>

      <div class="mb-10">
        <div
          id="competencyMap"
          class="body-1 font-weight-bold pb-2 mb-8"
          :class="darkMode ? null : 'primary--text'"
          style="border-bottom: 1px solid;"
          :style="{
            borderColor: darkMode ? 'white' : '#003865',
          }"
        >
          <div class="d-flex justify-space-between align-end">
            {{ $t('competencyMap.title') }}

            <!--<v-btn
              class="px-1"
              text
              small
              @click="mixToggleHowTo(['competencyOverview'])"
            >
              {{ $t('interactive.howToRead') }}
              <v-icon
                class="px-1"
                size="15"
              >
                mdi-alert-circle-outline
              </v-icon>
            </v-btn>-->
          </div>
        </div>

        <div v-if="report">
          <CompetencyMap
            :report="report"
            :formatted-map-data="formattedMapData"
            :user-plan-type="userPlanType"
          />
        </div>
      </div>

      <div
        v-if="userPlanType !== 'free'"
        class="mb-10"
      >
        <div
          id="competencyOverview"
          class="body-1 font-weight-bold pb-2 mb-8"
          :class="darkMode ? null : 'primary--text'"
          style="border-bottom: 1px solid;"
          :style="{
            borderColor: darkMode ? 'white' : '#003865',
          }"
        >
          <div class="d-flex justify-space-between align-end">
            {{ $t('indexes.competencyOverview') }}

            <v-btn
              class="px-1"
              text
              small
              @click="mixToggleHowTo(['competencyOverview', 'itemMatrix'])"
            >
              {{ $t('interactive.howToRead') }}
              <v-icon
                class="px-1"
                size="15"
              >
                mdi-alert-circle-outline
              </v-icon>
            </v-btn>
          </div>
        </div>

        <div v-if="report">
          <CompetencySummary
            :report="report"
            :user-plan-type="userPlanType"
          />
        </div>
      </div>
    </div>

    <HowToRead
      :option="mixHowToOption"
      :show.sync="mixHowToDialog"
      :user-plan-type="userPlanType"
    />

    <!-- Sticky vertical road -->
    <div
      v-if="$vuetify.breakpoint.mdAndUp"
      style="position: absolute; top: 0; right: -200px; height: 100%; pointer-events: none;"
    >
      <CompetenciesToView
        :report="report"
        :formatted-map-data="formattedMapData"
      />
    </div>
  </MainCol>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';
import howToDialog from '@/mixins/howToDialog';
import CompetencyPercentileRadar from './widget/CompetencyPercentileRadar.vue';
import CompetencyBrief from './widget/CompetencyBrief.vue';
import CompetencyMap from './widget/CompetencyMap.vue';
import CompetencySummary from './widget/CompetencySummary.vue';
import HowToRead from '../common/HowToRead.vue';
import CompetenciesToView from './widget/CompetenciesToView.vue';

export default {
  name: 'ReportOverview',

  components: {
    CompetencyPercentileRadar,
    CompetencyBrief,
    CompetencyMap,
    CompetencySummary,
    HowToRead,
    CompetenciesToView,
  },

  mixins: [
    commonDisplay,
    howToDialog,
  ],

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },

    report: {
      type: Object,
      default: null,
    },

    formattedMapData: {
      type: Object,
      default: null,
    },
  },
};
</script>
