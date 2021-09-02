<template>
  <div class="chart">
    <MapChart
      v-if="formattedMapData"
      :report="report"
      :data="formattedMapData"
      :class="$vuetify.breakpoint.smAndDown ? 'mb-6' : null"
    />
    <div
      v-else
      class="text-center pb-6 mx-auto"
      style="max-width: 550px;"
    >
      <i>
        <i18n path="interactive.mapPlaceholder">
          <template #email>
            support@globalcoachgroup.com
          </template>
        </i18n>
      </i>
    </div>

    <CompetencyBanners
      v-if="formattedMapData && !(userPlanType === 'free' && $vuetify.breakpoint.smAndDown)"
      :interactive="true"
      :report="report"
      :data="formattedMapData"
      :user-plan-type="userPlanType"
    />
  </div>
</template>

<script>
import glaStructure from '@/mixins/glaStructure';
import MapChart from './components/competencyMap/MapChart.vue';
import CompetencyBanners from './components/competencyMap/CompetencyBanners.vue';

export default {
  name: 'CompetencyMap',

  components: {
    MapChart,
    CompetencyBanners,
  },

  mixins: [
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

    userPlanType: {
      type: String,
      default: 'free',
    },
  },
};
</script>
